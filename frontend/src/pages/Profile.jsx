import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import BookRequestModal from "../components/BookRequestModal";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });
  const [popup, setPopup] = useState(null);
  const [lateFeesPopup, setLateFeesPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [booksData, setBooksData] = useState({
    issuedbooks: [],
    returnedbooks: [],
    returndue: [],
    transactions: [],
    requestedbooks: [], // ✅ add this
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) return navigate("/signin", { replace: true });

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, email, profile_picture, role")
        .eq("id", sessionData.session.user.id)
        .single();

      if (userError) return navigate("/signin", { replace: true });

      setUser(userData);
      setUserPhoto(userData.profile_picture || "https://via.placeholder.com/150");
      const fetchBooksData = async (userId) => {
        try {
          // All books currently issued (not returned)
          const { data: issuedBooks, error: issuedError } = await supabase
            .from("issued_books")
            .select("*, books(author,title)") // joins books data
            .eq("user_id", userId)
          console.log("Fetched issued books:", issuedBooks);

          // All returned books
          const { data: returnedBooks, error: returnedError } = await supabase
            .from("issued_books")
            .select("*, books(title, author)")
            .eq("user_id", userId)
            .is("returned", true);

          // Books that are overdue and not returned
          const { data: returnDueBooks, error: dueError } = await supabase
            .from("issued_books")
            .select("*, books(*)")
            .eq("user_id", userId) // due_date in the past
            .is("return_date", null);
          console.log("Fetched return due books:", returnDueBooks);
          if (issuedError || returnedError || dueError) {
            console.error(
              "Error fetching books data:",
              issuedError || returnedError || dueError
            );
            return;
          }

          setBooksData({
            issuedbooks: issuedBooks || [],
            returnedbooks: returnedBooks || [],
            returndue: returnDueBooks || [],
          });
        } catch (err) {
          console.error("Unexpected error:", err);
        }

      };
      await fetchBooksData(userData.id);
      setLoading(false);
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*, books(title, author)")
        .eq("user_id", userData.id)
        .order("action_date", { ascending: false });

      if (transactionsError) {
        console.error("Error fetching transactions:", transactionsError);
      } else {
        setBooksData(prev => ({ ...prev, transactions: transactionsData || [] }));
      }
      const { data: requestedBooks, error: requestedBooksError } = await supabase
        .from("book_requests") // or whatever your table name is
        .select("*")
        .eq("user_id", userData.id);

      if (requestedBooksError) {
        console.error("Error fetching requested books:", requestedBooksError);
      } else {
        setBooksData(prev => ({ ...prev, requestedbooks: requestedBooks || [] }));
      }

      // Redirect to AdminProfile if role is admin
      if (userData.role === "admin") {
        navigate("/adminprofile", { replace: true });
      }
    };

    fetchProfile();

  }, [navigate]);


  const handleEditClick = () => {
    setEditData({ name: user?.name, email: user?.email, password: "" });
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    const { name, email, password } = editData;
    const updates = { name, email };
    if (password) {
      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) {
        console.error("Password update failed:", pwError.message);
        return;
      }
    }
    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (!error) {
      setUser({ ...user, name, email });
      setIsEditing(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    const filePath = `user_${user.id}/profile_pictures/${file.name}_${Date.now()}`;
    if (user.profile_picture) {
      const oldFilePath = user.profile_picture.split("/").slice(-2).join("/");
      await supabase.storage.from("profile-pictures").remove([oldFilePath]);
    }
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    const imageUrl = publicUrlData.publicUrl;
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture: imageUrl })
      .eq("id", user.id);
    if (!updateError) {
      setUserPhoto(imageUrl);
      setUser({ ...user, profile_picture: imageUrl });
      alert("Profile picture updated successfully!");
    }
  };

  const openPopup = (type) => setPopup(type);
  const closePopup = () => setPopup(null);

  const handleReturnBook = async (bookId) => {
    // Fetch the book to get current copies
    console.log("Book ID:", bookId);
    const { data: book, error: fetchError } = await supabase
      .from("issued_books")
      .select("*,books(*)")
      .eq("book_id", bookId)
    // .single();

    if (fetchError) {
      console.error("Failed to fetch book:", fetchError.message);
      console.log(bookId)
      return;
    }
    console.log("Fetched book:", book[0]);
    const { error: updateError } = await supabase
      .from("books")
      .update({
        copies: book[0].books.copies + 1,
      })
      .eq("id", bookId);

    if (updateError) {
      console.error("Failed to return book:", updateError.message);
      return;
    }


    const { error: transactionsError } = await supabase.from("transactions").insert([
      {
        user_id: book[0].user_id,
        book_id: book[0].book_id,
        action: "book return",
        fine_amount: book[0].lateFees || 0,
        action_date: new Date().toISOString(),
        notes: "Returned with late fees"
      }
    ]);
    console.log("Transaction data:", book[0].user_id, book[0].book_id, book[0].lateFees || 0);
    if (transactionsError) {
      console.error("Transaction insertion failed:", transactionsError.message);
      return;
    }
    const today = new Date();

    let lateFees = 0;
    const dueDate = new Date(book.due_date);

    if (today > dueDate) {
      const lateDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      lateFees = lateDays * 5; // $5 per day
    }

    // Step 3: Update the issued book record
    const { error: latefeesupdateError } = await supabase
      .from("issued_books")
      .update({
        returned: true,
        return_date: today.toISOString(),
        lateFees: lateFees,
      })
      .eq("book_id", bookId);
    console.log("book id:", bookId);
    if (latefeesupdateError) {
      console.error("Error updating book:", latefeesupdateError.message);
    } else {
      console.log("Book returned and late fees updated:", lateFees);
    }


    // Refresh data
    window.location.reload(); // or call fetchProfile() if you move it out
  };

  const calculateTotalFees = (type) => {
    const today = new Date();

    return booksData[type].reduce((total, book) => {
      let lateFees = 0;

      if (!book.returned && book.due_date) {
        const dueDate = new Date(book.due_date);

        if (today > dueDate) {
          const lateDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          lateFees = lateDays * 5; // $5 per day
        }
      } else if (book.lateFees) {
        lateFees = book.lateFees;
      }

      return total + lateFees;
    }, 0);
  };

  const totalReturnedFees = calculateTotalFees("returnedbooks");
  const totalDueFees = calculateTotalFees("returndue");
  const totalLateFees = totalReturnedFees + totalDueFees;

  const handlePayNow = () => {
    setBooksData({
      ...booksData,
      returnedbooks: booksData.returnedbooks.map(book => ({ ...book, lateFees: 0 })),
      returndue: booksData.returndue.map(book => ({ ...book, lateFees: 0 }))
    });
    setPaymentSuccess(true);
  };

  const closePaymentSuccess = () => {
    setPaymentSuccess(false);
    setLateFeesPopup(false);
  };
  console.log("data; ",booksData);
  if (loading) return <p>Loading profile...</p>;
  if (!booksData) return <p>Loading book data...</p>;

  return (
    <div className="min-h-screen w-full bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-4xl relative border border-white/20">
        {/* Profile Header */}
        <div className="flex items-center gap-6 border-b border-gray-500 pb-4">
          <div className="relative w-24 h-24">
            <div className="rounded-full overflow-hidden w-full h-full">
              <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photoInput"
            />
            <label
              htmlFor="photoInput"
              className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-500 text-white p-2 rounded-full text-sm cursor-pointer hover:bg-blue-600 transition-all z-10"
            >
              📷
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
            <p className="text-gray-300">{user?.email}</p>
            <p className="text-gray-400 text-sm mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="absolute top-25 right-7 text-right">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300"
            onClick={handleEditClick}
          >
            ✏️ Edit
          </button>
        </div>

        {/* Main Buttons */}
        <div className="flex flex-col items-center mt-6 gap-4">
          {["Issued Books", "Returned Books", "Return Due", "Requested Books", "Transactions", "Late Fees"].map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
              className={`w-64 bg-gray-800 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-gray-700 ${label === "Late Fees" && totalLateFees === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={() => {
                if (label === "Issued Books") openPopup("issuedbooks");
                if (label === "Returned Books") openPopup("returnedbooks");
                if (label === "Return Due") openPopup("returndue");
                if (label === "Late Fees" && totalLateFees > 0) setLateFeesPopup(true);
                if (label === "Transactions") openPopup("transactions");
                if (label === "Requested Books") openPopup("requestedbooks");
              }}
              disabled={label === "Late Fees" && totalLateFees === 0}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
              <label className="block mb-2">
                <span className="text-gray-400">Name</span>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-700 text-white"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-400">Email</span>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-700 text-white"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-400">New Password</span>
                <input
                  type="password"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-gray-700 text-white"
                />
              </label>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Books & Transaction Popup */}
      <AnimatePresence>
        {popup && popup !== "requestedbooks" && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            />
            <motion.div
              className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {popup === "issuedbooks"
                  ? "Issued Books"
                  : popup === "returnedbooks"
                    ? "Returned Books"
                    : popup === "returndue"
                      ? "Return Due"
                      : "Transactions"}
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {popup === "transactions" ? (
                  <>
                    <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                      <span className="w-1/3">Book</span>
                      <span className="w-1/4 text-center">Type</span>
                      <span className="w-1/4 text-right">Amount</span>
                      <span className="w-1/4 text-right">Date</span>
                    </div>
                    {booksData.transactions.length > 0 ? (
                      booksData.transactions.map((txn, index) => (
                        <motion.div
                          key={txn.id || index}
                          className="flex justify-between p-3 bg-gray-700 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span className="w-1/3">{txn.books.title || "N/A"}</span>
                          <span className="w-1/4 text-center capitalize">{txn.action || ""}</span>
                          <span className="w-1/4 text-right">${txn.fine_amount || 0}</span>
                          <span className="w-1/4 text-right">{new Date(txn.action_date).toLocaleDateString()}</span>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-400">No transactions found</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                      <span className="w-1/3">Book Name</span>
                      <span className="w-1/3 text-center">Author Name</span>
                      <span className={popup === "returndue" ? "w-1/6 text-right" : "w-1/3 text-right"}>Date</span>
                      {(popup === "returndue" || popup === "returnedbooks") && (
                        <span className="w-1/6 text-right">Late Fees</span>
                      )}
                      {popup === "returndue" && <span className="w-1/6 text-right">Action</span>}
                    </div>
                    {booksData[popup].length > 0 ? (
                      booksData[popup].map((book, index) => (
                        <motion.div
                          key={index}
                          className="flex justify-between p-3 bg-gray-700 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="w-1/3">{book.books?.title || "N/A"}</span>
                          <span className="w-1/3 text-center">{book.books?.author || "N/A"}</span>
                          <span className={popup === "returndue" ? "w-1/6 text-right" : "w-1/3 text-right"}>
                            {book.issue_date}
                          </span>
                          {(popup === "returndue" || popup === "returnedbooks") && (
                            <span className="w-1/6 text-right">${book.lateFees || 0}</span>
                          )}
                          {popup === "returndue" && (
                            <span className="w-1/6 text-right">
                              <button
                                className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
                                onClick={() => handleReturnBook(book.book_id)}
                              >
                                Return
                              </button>
                            </span>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-400">No data available</p>
                    )}
                  </>
                )}
              </div>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                onClick={closePopup}
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Book Request Modal */}
      <AnimatePresence>
        {popup === "requestedbooks" && (
          <BookRequestModal setShowModal={() => setPopup(null)} />
        )}
      </AnimatePresence>

      {/* Late Fees Modal */}
      <AnimatePresence>
        {lateFeesPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLateFeesPopup(false)}
            />
            <motion.div
              className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Late Fees</h3>
              <p className="mb-4">Total Late Fees: ${totalLateFees}</p>
              <div className="flex justify-between">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handlePayNow}
                >
                  Pay Now
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setLateFeesPopup(false)}
                >
                  Pay Later
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePaymentSuccess}
            />
            <motion.div
              className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Payment Successful</h3>
              <p className="mb-4">Your late fees have been successfully paid!</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
                onClick={closePaymentSuccess}
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

}

export default Profile;