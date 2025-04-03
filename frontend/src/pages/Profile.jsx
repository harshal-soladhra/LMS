import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

// Dummy data for books
const dummyBooks = {
  issuedbooks: [
    { bookName: "The Great Gatsby", author: "F. Scott Fitzgerald", issuedDate: "2025-03-01" },
    { bookName: "1984", author: "George Orwell", issuedDate: "2025-02-15" },
    { bookName: "To Kill a Mockingbird", author: "Harper Lee", issuedDate: "2025-01-20" },
    { bookName: "Pride and Prejudice", author: "Jane Austen", issuedDate: "2025-03-10" },
  ],
  returnedbooks: [
    { bookName: "Moby Dick", author: "Herman Melville", issuedDate: "2024-12-01" },
    { bookName: "The Catcher in the Rye", author: "J.D. Salinger", issuedDate: "2024-11-15" },
    { bookName: "Brave New World", author: "Aldous Huxley", issuedDate: "2024-10-20" },
    { bookName: "Jane Eyre", author: "Charlotte Brontë", issuedDate: "2024-09-10" },
  ],
  returndue: [
    { bookName: "The Hobbit", author: "J.R.R. Tolkien", issuedDate: "2025-03-15" },
    { bookName: "Fahrenheit 451", author: "Ray Bradbury", issuedDate: "2025-02-28" },
    { bookName: "The Odyssey", author: "Homer", issuedDate: "2025-01-30" },
    { bookName: "Dracula", author: "Bram Stoker", issuedDate: "2025-03-05" },
  ],
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });
  const [popup, setPopup] = useState(null); // For managing popups

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
      setUserPhoto(userData.profile_picture || "");
      setLoading(false);
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
    if (password) updates.password = password;

    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (!error) {
      setUser({ ...user, name, email });
      setIsEditing(false);
    }
  };

  const openPopup = (type) => {
    setPopup(type);
  };

  const closePopup = () => setPopup(null);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gray-900 flex justify-center items-center p-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-full max-w-4xl relative border border-white/20">
        {/* Profile Section */}
        <div className="flex items-center gap-6 border-b border-gray-500 pb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img src={userPhoto || "https://via.placeholder.com/150"} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
            <p className="text-gray-300">{user?.email}</p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleEditClick}
        >
          ✏️ Edit
        </button>

        {/* Action Buttons */}
        <div className="flex flex-col items-center mt-6 gap-4">
          {["Issued Books", "Returned Books", "Return Due", "Requested Books", "Transactions"].map((label, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }}
              className="w-64 bg-gray-800 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-gray-700"
              onClick={() => {
                if (label === "Issued Books") openPopup("issuedbooks");
                if (label === "Returned Books") openPopup("returnedbooks");
                if (label === "Return Due") openPopup("returndue");
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
            />

            {/* Modal */}
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

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition-all" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Book Popup */}
      <AnimatePresence>
        {popup && (
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
                {popup === "issuedbooks" ? "Issued Books" : popup === "returnedbooks" ? "Returned Books" : "Return Due"}
              </h3>
              <div className="space-y-4">
                {/* Column Titles */}
                <div className="flex justify-between p-3 bg-blue-600 rounded-lg font-semibold">
                  <span className="w-1/3">Book Name</span>
                  <span className="w-1/3 text-center">Author Name</span>
                  <span className="w-1/3 text-right">Date</span>
                </div>
                {/* Book Data */}
                {dummyBooks[popup].length > 0 ? (
                  dummyBooks[popup].map((book, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between p-3 bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-1/3">{book.bookName}</span>
                      <span className="w-1/3 text-center">{book.author}</span>
                      <span className="w-1/3 text-right">{book.issuedDate}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No data available</p>
                )}
              </div>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full"
                onClick={closePopup}
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