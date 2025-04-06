import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import { addBook } from "../api";

// Dummy data for admin features
const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "member" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "librarian" },
  { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" },
];

const dummyBookRequests = [
  { id: 1, userName: "John Doe", bookName: "Dune", status: "pending" },
  { id: 2, userName: "Jane Smith", bookName: "The Alchemist", status: "pending" },
];

const dummyReturnRequests = [
  { id: 1, userName: "John Doe", bookName: "Dune", status: "pending", lateFee: 10 },
  { id: 2, userName: "Jane Smith", bookName: "The Alchemist", status: "pending", lateFee: 5 },
];

const dummyReservations = [
  { id: 1, userName: "John Doe", bookName: "1984", status: "pending" },
  { id: 2, userName: "Jane Smith", bookName: "To Kill a Mockingbird", status: "pending" },
];

const dummyTransactions = [
  { id: 1, userName: "John Doe", bookName: "Dune", status: "completed", lateFee: 10 },
  { id: 2, userName: "Jane Smith", bookName: "The Alchemist", status: "completed", lateFee: 5 },
];

const dummyBooks = [
  { id: 1, title: "Dune", author: "Frank Herbert", isbn: "978-0441172719" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", isbn: "978-0062315007" },
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });
  const [usersPopup, setUsersPopup] = useState(false);
  const [manageBooksPopup, setManageBooksPopup] = useState(false);
  const [requestsPopup, setRequestsPopup] = useState(false);
  const [returnRequestsPopup, setReturnRequestsPopup] = useState(false);
  const [reservationsPopup, setReservationsPopup] = useState(false);
  const [transactionPopup, setTransactionPopup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [commentPopup, setCommentPopup] = useState(null); // { id, action }
  const [commentText, setCommentText] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [books, setBooks] = useState(dummyBooks);
  const [addBooksPopup, setAddBooksPopup] = useState(false);
  const [isbnPopup, setIsbnPopup] = useState(false);
  const [manualAddPopup, setManualAddPopup] = useState(false);
  const [modifyBooksPopup, setModifyBooksPopup] = useState(false);
  const [editBookPopup, setEditBookPopup] = useState(null); // { id, title, author, isbn, ... }
  const [deleteBooksPopup, setDeleteBooksPopup] = useState(false);
  const [isbnInput, setIsbnInput] = useState("");
  const [manualBookData, setManualBookData] = useState({
    coverImage: "",
    title: "",
    author: "",
    publicationDate: "",
    isbn: "",
    addition: "",
    language: "",
    copies: ""
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

      if (userError || userData.role !== "admin") return navigate("/profile", { replace: true });

      setUser(userData);
      setUserPhoto(userData.profile_picture || "https://via.placeholder.com/150");
      setLoading(false);
      fetchAllUsers();
      fetchBookRequests();
      fetchReturnRequests();
      fetchReservations();
      fetchTransactions();
    };

    fetchProfile();
  }, [navigate]);

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("users").select("id, name, email, role");
    if (!error) setAllUsers(data || dummyUsers);
  };

  const fetchBookRequests = async () => {
    const { data, error } = await supabase.from("book_requests").select("id, user_id, book_name, status");
    if (!error) {
      const requestsWithUsernames = await Promise.all(
        data.map(async (request) => {
          const { data: userData } = await supabase.from("users").select("name").eq("id", request.user_id).single();
          return { ...request, userName: userData?.name || "Unknown" };
        })
      );
      setBookRequests(requestsWithUsernames || dummyBookRequests);
    } else {
      setBookRequests(dummyBookRequests);
    }
  };

  const fetchReturnRequests = async () => {
    const { data, error } = await supabase.from("return_requests").select("id, user_id, book_name, status, late_fee");
    if (!error) {
      const requestsWithUsernames = await Promise.all(
        data.map(async (request) => {
          const { data: userData } = await supabase.from("users").select("name").eq("id", request.user_id).single();
          return { ...request, userName: userData?.name || "Unknown", lateFee: request.late_fee || 0 };
        })
      );
      setReturnRequests(requestsWithUsernames || dummyReturnRequests);
    } else {
      setReturnRequests(dummyReturnRequests);
    }
  };

  const fetchReservations = async () => {
    const { data, error } = await supabase.from("reservations").select("id, user_id, book_id, status");
    if (!error) {
      const reservationsWithUsernames = await Promise.all(
        data.map(async (reservation) => {
          const { data: userData } = await supabase.from("users").select("name").eq("id", reservation.user_id).single();
          return { ...reservation, userName: userData?.name || "Unknown" };
        })
      );
      setReservations(reservationsWithUsernames || dummyReservations);
    } else {
      setReservations(dummyReservations);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("id, user_id, book_name, status, late_fee");
    if (!error) {
      const transactionsWithUsernames = await Promise.all(
        data.map(async (transaction) => {
          const { data: userData } = await supabase.from("users").select("name").eq("id", transaction.user_id).single();
          return { ...transaction, userName: userData?.name || "Unknown", lateFee: transaction.late_fee || 0 };
        })
      );
      setTransactions(transactionsWithUsernames || dummyTransactions);
    } else {
      setTransactions(dummyTransactions);
    }
  };

  const handleEditClick = () => {
    setEditData({ name: user?.name, email: user?.email, password: "" });
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    const { name, email, password } = editData;
    const updates = { name, email };
    if (password) updates.password = password;

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

    if (uploadError) return;

    const { data: publicUrlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    const imageUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase.from("users").update({ profile_picture: imageUrl }).eq("id", user.id);
    if (!updateError) {
      setUserPhoto(imageUrl);
      setUser({ ...user, profile_picture: imageUrl });
    }
  };

  const handleAddBook = async () => {
    if (!isbn) {
      alert("Please enter an ISBN number.");
      return;
    }

    setLoading(true);
    const response = await addBook(isbn);
    setLoading(false);

    alert(response.message);
    if (response.success) {
      navigate("/profile");
    }
  };

  const handlemanualsubmit = async () => {
    if (!manualBookData.title || !manualBookData.author || !manualBookData.publicationDate || !manualBookData.copies) {
      alert("Please fill in all required fields.");
      return;
    }
    const book = {
      title: manualBookData.title || "Unknown",
      author: manualBookData.authors ? manualBookData.authors.join(", ") : "Unknown",
      isbn: isbn,
      genre: manualBookData.categories ? manualBookData.categories[0] : "Unknown",
      language: manualBookData.language || "Unknown",
      edition: manualBookData.publicationDate || "Unknown",
      copies: manualBookData.copies || 1 // Default to 1 copy
    };
    const { data, error } = await supabase.from("books").insert([book]);
    if (error) throw error;
    setSuccessPopup("Book successfully added!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  const handleAddBookByIsbn = async () => {
    if (!isbnInput) return;
    const newBook = { id: Date.now(), title: `Book_${isbnInput}`, author: "Unknown", isbn: isbnInput };
    setBooks([...books, newBook]);
    setIsbnPopup(false);
    setAddBooksPopup(false);
    setManageBooksPopup(false);
    setIsbnInput("");
    setSuccessPopup("Book successfully added!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  const handleManualAddSubmit = async () => {
    if (!manualBookData.title || !manualBookData.author || !manualBookData.publicationDate || !manualBookData.copies) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(manualBookData);
    const book = {
      title: manualBookData.title || "Unknown",
      author: manualBookData.author ? manualBookData.author.join(", ") : "Unknown",
      isbn: manualBookData.isbn || "",
      cover_url: manualBookData.coverImage || "",
      genre: manualBookData.categories ? manualBookData.categories[0] : "Unknown",
      language: manualBookData.language || "Unknown",
      edition: manualBookData.publicationDate || "Unknown",
      copies: manualBookData.copies || 1 // Default to 1 copy
    };
    const { data, error } = await supabase.from("books").insert([book]);
    if (error) throw error;
    setSuccessPopup("Book successfully added!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  const handleEditBook = (book) => {
    setEditBookPopup(book);
  };

  const handleModifyBookSubmit = async () => {
    setBooks(books.map(book => book.id === editBookPopup.id ? { ...editBookPopup } : book));
    setEditBookPopup(null);
    setModifyBooksPopup(false);
    setManageBooksPopup(false);
    setSuccessPopup("Book successfully modified!");
    setTimeout(() => navigate("/profile"), 1000);
  };

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const calculateTotalFee = () => {
    return transactions.reduce((total, transaction) => total + (transaction.lateFee || 0), 0);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-4xl relative border border-white/20">
        <div className="flex items-center gap-6 border-b border-gray-500 pb-4">
          <div className="relative w-24 h-24">
            <div className="rounded-full overflow-hidden w-full h-full">
              <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photoInput" />
            <label htmlFor="photoInput" className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-500 text-white p-2 rounded-full text-sm cursor-pointer hover:bg-blue-600 transition-all z-10">📷</label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
            <p className="text-gray-300">{user?.email}</p>
            <p className="text-gray-400 text-sm mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="absolute top-25 right-7 text-right">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300" onClick={handleEditClick}>✏️ Edit</button>
        </div>

        <div className="flex flex-col items-center mt-6 gap-4">
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setUsersPopup(true)}>View All Users</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setManageBooksPopup(true)}>Manage Books</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setRequestsPopup(true)}>Approve Book Requests</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setReturnRequestsPopup(true)}>Approve Return Request</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setReservationsPopup(true)}>Approve Reservation</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setTransactionPopup(true)}>Transaction</motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
              <label className="block mb-2"><span className="text-gray-400">Name</span><input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" /></label>
              <label className="block mb-2"><span className="text-gray-400">Email</span><input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" /></label>
              <label className="block mb-2"><span className="text-gray-400">New Password</span><input type="password" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" /></label>
              <div className="flex justify-end mt-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition-all" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all" onClick={handleSaveChanges}>Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {usersPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setUsersPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">All Users</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold"><span className="w-1/3">Name</span><span className="w-1/3 text-center">Email</span><span className="w-1/3 text-right">Role</span></div>
                {allUsers.length > 0 ? allUsers.map((user, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/3">{user.name}</span><span className="w-1/3 text-center">{user.email}</span><span className="w-1/3 text-right capitalize">{user.role}</span>
                  </motion.div>
                )) : <p className="text-gray-400">No users found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setUsersPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {manageBooksPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setManageBooksPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Manage Books</h3>
              <div className="flex justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                  onClick={() => setAddBooksPopup(true)}
                >
                  Add Books
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => setModifyBooksPopup(true)}
                >
                  Modify Books
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  onClick={() => setDeleteBooksPopup(true)}
                >
                  Delete Books
                </motion.button>
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setManageBooksPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addBooksPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddBooksPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-60" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Add Books</h3>
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => setIsbnPopup(true)}
                >
                  By ISBN Number
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => setManualAddPopup(true)}
                >
                  By Manual Add
                </motion.button>
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setAddBooksPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isbnPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsbnPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-70" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Add Book by ISBN</h3>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Enter ISBN Number"
                className="w-full p-2 border rounded-lg bg-gray-700 text-white mb-4"
              />
              <div className="flex justify-end gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all" onClick={() => setIsbnPopup(false)}>Cancel</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all" onClick={handleAddBook}>Add</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {manualAddPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setManualAddPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-70" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Manually Add Book</h3>
              <div className="space-y-3">
                <input type="file" accept="image/*" onChange={(e) => setManualBookData({ ...manualBookData, coverImage: URL.createObjectURL(e.target.files[0]) })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={manualBookData.title} onChange={(e) => setManualBookData({ ...manualBookData, title: e.target.value })} placeholder="Title" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={manualBookData.author} onChange={(e) => setManualBookData({ ...manualBookData, author: e.target.value })} placeholder="Author Name" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="date" value={manualBookData.publicationDate} onChange={(e) => setManualBookData({ ...manualBookData, publicationDate: e.target.value })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={manualBookData.isbn} onChange={(e) => setManualBookData({ ...manualBookData, isbn: e.target.value })} placeholder="ISBN Number (Optional)" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={manualBookData.addition} onChange={(e) => setManualBookData({ ...manualBookData, addition: e.target.value })} placeholder="Addition" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={manualBookData.language} onChange={(e) => setManualBookData({ ...manualBookData, language: e.target.value })} placeholder="Language" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="number" value={manualBookData.copies} onChange={(e) => setManualBookData({ ...manualBookData, copies: e.target.value })} placeholder="Copies" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all" onClick={() => setManualAddPopup(false)}>Cancel</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all" onClick={handleManualAddSubmit}>Add</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modifyBooksPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModifyBooksPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-60" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Modify Books</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/4">Book Name</span>
                  <span className="w-1/4 text-center">Author Name</span>
                  <span className="w-1/4 text-center">ISBN Number</span>
                  <span className="w-1/4 text-right">Action</span>
                </div>
                {books.length > 0 ? books.map((book, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/4">{book.title}</span>
                    <span className="w-1/4 text-center">{book.author}</span>
                    <span className="w-1/4 text-center">{book.isbn}</span>
                    <span className="w-1/4 text-right">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-all" onClick={() => handleEditBook(book)}>Edit</button>
                    </span>
                  </motion.div>
                )) : <p className="text-gray-400">No books found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setModifyBooksPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editBookPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditBookPopup(null)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-70" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Edit Book</h3>
              <div className="space-y-3">
                <input type="file" accept="image/*" onChange={(e) => setEditBookPopup({ ...editBookPopup, coverImage: URL.createObjectURL(e.target.files[0]) })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={editBookPopup.title} onChange={(e) => setEditBookPopup({ ...editBookPopup, title: e.target.value })} placeholder="Title" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={editBookPopup.author} onChange={(e) => setEditBookPopup({ ...editBookPopup, author: e.target.value })} placeholder="Author Name" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="date" value={editBookPopup.publicationDate || ""} onChange={(e) => setEditBookPopup({ ...editBookPopup, publicationDate: e.target.value })} className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={editBookPopup.isbn} onChange={(e) => setEditBookPopup({ ...editBookPopup, isbn: e.target.value })} placeholder="ISBN Number (Optional)" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={editBookPopup.addition || ""} onChange={(e) => setEditBookPopup({ ...editBookPopup, addition: e.target.value })} placeholder="Addition" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="text" value={editBookPopup.language || ""} onChange={(e) => setEditBookPopup({ ...editBookPopup, language: e.target.value })} placeholder="Language" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
                <input type="number" value={editBookPopup.copies || ""} onChange={(e) => setEditBookPopup({ ...editBookPopup, copies: e.target.value })} placeholder="Copies" className="w-full p-2 border rounded-lg bg-gray-700 text-white" />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all" onClick={() => setEditBookPopup(null)}>Cancel</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all" onClick={handleModifyBookSubmit}>Modify</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteBooksPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteBooksPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-60" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Delete Books</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/4">Book Name</span>
                  <span className="w-1/4 text-center">Author Name</span>
                  <span className="w-1/4 text-center">ISBN Number</span>
                  <span className="w-1/4 text-right">Action</span>
                </div>
                {books.length > 0 ? books.map((book, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/4">{book.title}</span>
                    <span className="w-1/4 text-center">{book.author}</span>
                    <span className="w-1/4 text-center">{book.isbn}</span>
                    <span className="w-1/4 text-right">
                      <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                    </span>
                  </motion.div>
                )) : <p className="text-gray-400">No books found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setDeleteBooksPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {requestsPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestsPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Book Requests</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold"><span className="w-1/4">User</span><span className="w-1/4 text-center">Book Name</span><span className="w-1/4 text-center">Status</span><span className="w-1/4 text-right">Action</span></div>
                {bookRequests.length > 0 ? bookRequests.map((request, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/4">{request.userName}</span><span className="w-1/4 text-center">{request.bookName}</span><span className="w-1/4 text-center capitalize">{request.status}</span>
                    <span className="w-1/4 text-right flex gap-2 justify-end">
                      {request.status === "pending" && (
                        <>
                          <button className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-all" onClick={() => handleApproveRequest(request.id)}>Approve</button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                        </>
                      )}
                    </span>
                  </motion.div>
                )) : <p className="text-gray-400">No requests found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setRequestsPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {returnRequestsPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReturnRequestsPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Approve Return Requests</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/5">User</span><span className="w-1/5 text-center">Book Name</span><span className="w-1/5 text-center">Status</span><span className="w-1/5 text-center">Late Fee</span><span className="w-1/5 text-right">Action</span>
                </div>
                {returnRequests.length > 0 ? returnRequests.map((request, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/5">{request.userName}</span><span className="w-1/5 text-center">{request.bookName}</span><span className="w-1/5 text-center capitalize">{request.status}</span><span className="w-1/5 text-center">${request.lateFee}</span>
                    <span className="w-1/5 text-right flex gap-2 justify-end">
                      {request.status === "pending" && (
                        <>
                          <button className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-all" onClick={() => handleApproveReturn(request.id)}>Approve</button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all" onClick={() => handleRejectReturn(request.id)}>Reject</button>
                        </>
                      )}
                    </span>
                  </motion.div>
                )) : <p className="text-gray-400">No return requests found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setReturnRequestsPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reservationsPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReservationsPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Approve Reservations</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/4">User</span><span className="w-1/4 text-center">Book Name</span><span className="w-1/4 text-center">Status</span><span className="w-1/4 text-right">Action</span>
                </div>
                {reservations.length > 0 ? reservations.map((reservation, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/4">{reservation.userName}</span><span className="w-1/4 text-center">{reservation.bookName}</span><span className="w-1/4 text-center capitalize">{reservation.status}</span>
                    <span className="w-1/4 text-right flex gap-2 justify-end">
                      {reservation.status === "pending" && (
                        <>
                          <button className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-all" onClick={() => handleApproveReservation(reservation.id)}>Approve</button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all" onClick={() => handleRejectReservation(reservation.id)}>Reject</button>
                        </>
                      )}
                    </span>
                  </motion.div>
                )) : <p className="text-gray-400">No reservations found</p>}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setReservationsPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transactionPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTransactionPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Transactions</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/5">User</span>
                  <span className="w-1/5 text-center">Book Name</span>
                  <span className="w-1/5 text-center">Status</span>
                  <span className="w-1/5 text-center">Late Fee</span>
                  <span className="w-1/5 text-center">Total Fee</span>
                </div>
                {transactions.length > 0 ? transactions.map((transaction, index) => (
                  <motion.div key={index} className="flex justify-between p-3 bg-gray-700 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <span className="w-1/5">{transaction.userName}</span>
                    <span className="w-1/5 text-center">{transaction.bookName}</span>
                    <span className="w-1/5 text-center capitalize">{transaction.status}</span>
                    <span className="w-1/5 text-center">${transaction.lateFee}</span>
                    <span className="w-1/5 text-center">${transaction.lateFee}</span>
                  </motion.div>
                )) : <p className="text-gray-400">No transactions found</p>}
                {transactions.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg text-right">
                    <span className="font-semibold">Total Fee Collected: </span>
                    <span>${calculateTotalFee()}</span>
                  </div>
                )}
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setTransactionPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {commentPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCommentPopup(null)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Add Comment</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-2 border rounded-lg bg-gray-700 text-white h-32 resize-none"
              />
              <div className="flex justify-end mt-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition-all" onClick={() => setCommentPopup(null)}>Cancel</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all" onClick={handleCommentSubmit}>Done</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successPopup && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSuccessPopup(false)} />
            <motion.div className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 z-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h3 className="text-lg font-semibold mb-4">Success</h3>
              <p className="mb-4">{successPopup}</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all w-full" onClick={() => setSuccessPopup(false)}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;