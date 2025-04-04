import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

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

const AdminProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", password: "" });
  const [usersPopup, setUsersPopup] = useState(false);
  const [manageBooksPopup, setManageBooksPopup] = useState(false);
  const [requestsPopup, setRequestsPopup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);

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

  const handleAddBook = (bookName, author) => {
    console.log(`Added book: ${bookName} by ${author}`);
  };

  const handleApproveRequest = async (requestId) => {
    const { error } = await supabase.from("book_requests").update({ status: "approved" }).eq("id", requestId);
    if (!error) setBookRequests(bookRequests.map(req => req.id === requestId ? { ...req, status: "approved" } : req));
  };

  const handleRejectRequest = async (requestId) => {
    const { error } = await supabase.from("book_requests").update({ status: "rejected" }).eq("id", requestId);
    if (!error) setBookRequests(bookRequests.map(req => req.id === requestId ? { ...req, status: "rejected" } : req));
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
          </div>
        </div>

        <div className="absolute top-4 right-4 text-right">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300" onClick={handleEditClick}>✏️ Edit</button>
          <p className="text-gray-400 text-sm mt-1 capitalize">Role: {user?.role}</p>
        </div>

        <div className="flex flex-col items-center mt-6 gap-4">
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setUsersPopup(true)}>View All Users</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setManageBooksPopup(true)}>Manage Books</motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)" }} className="w-64 bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-blue-700" onClick={() => setRequestsPopup(true)}>Approve Book Requests</motion.button>
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
              <div className="space-y-4">
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
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <input type="text" placeholder="Book Name" className="p-2 border rounded-lg bg-gray-700 text-white" id="newBookName" />
                  <input type="text" placeholder="Author" className="p-2 border rounded-lg bg-gray-700 text-white" id="newBookAuthor" />
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all" onClick={() => {
                    const bookName = document.getElementById("newBookName").value;
                    const author = document.getElementById("newBookAuthor").value;
                    if (bookName && author) handleAddBook(bookName, author);
                  }}>Add Book</button>
                </div>
              </div>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all w-full" onClick={() => setManageBooksPopup(false)}>Close</button>
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
              <div className="space-y-4">
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
    </div>
  );
};

export default AdminProfile;