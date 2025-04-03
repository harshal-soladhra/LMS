import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import NavbarBooks from "../components/NavbarBooks";

const AvailableBooks = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [editionFilter, setEditionFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all books (available & unavailable)
  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("🔥 Error fetching books:", error.message);
      } else {
        setBooks(data);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  // ✅ Filter Books based on Search & Dropdown Filters
  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (genreFilter === "" || book.genre === genreFilter) &&
      (languageFilter === "" || book.language === languageFilter) &&
      (editionFilter === "" || book.edition === editionFilter)
    );
  });

  // ✅ Handle Book Issue
  const handleIssueBook = async (bookId, copies) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/SignIn");
      return;
    }

    if (copies <= 0) {
      alert("Sorry, this book is currently unavailable.");
      return;
    }

    try {
      const userId = "your-user-id"; // Replace with logged-in user ID
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days from today

      const { error } = await supabase
        .from("books")
        .update({
          issued_to: userId,
          issued_date: new Date(),
          due_date: dueDate,
          copies: copies - 1, // ✅ Reduce available copies
        })
        .eq("id", bookId);
      // ✅ Add a notification for the user
      await supabase.from("notifications").insert([
        {
          user_id: userData.id,
          message: `You have successfully issued the book! Due date: ${dueDate.toDateString()}`,
        },
      ]);
      if (error) throw error;
      alert("Book issued successfully!");
      window.location.reload();
    } catch (err) {
      console.error("🔥 Book Issue Error:", err);
      alert("Failed to issue book.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed top-16 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          {sidebarOpen && <NavbarBooks />}
        </div>

        <button
          className="fixed top-20 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "⬅" : "➡"}
        </button>

        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <h1 className="text-2xl font-bold mb-4 mt-20 text-blue-700">📚 Library Books</h1>

          {/* Search & Filters */}
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="🔍 Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="border p-2 rounded-md">
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science">Science</option>
            </select>
            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="border p-2 rounded-md">
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
            <select value={editionFilter} onChange={(e) => setEditionFilter(e.target.value)} className="border p-2 rounded-md">
              <option value="">All Editions</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
            </select>
          </div>

          {/* Book Collection */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📖 Book Collection</h2>
            {loading ? (
              <p>Loading books...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className={`p-4 bg-gray-100 shadow-md rounded-lg transition duration-300 ${book.copies === 0 ? "border-red-500 border-2" : "hover:shadow-xl"
                      }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-sm text-gray-600">Author: {book.author}</p>
                    <p className="text-sm text-gray-600">Genre: {book.genre}</p>
                    <p className="text-sm text-gray-600">Language: {book.language}</p>
                    <p className="text-sm text-gray-600">Edition: {book.edition}</p>
                    <p className="text-sm text-gray-600">
                      📚 Copies Available:{" "}
                      <span className={book.copies === 0 ? "text-red-500 font-bold" : ""}>
                        {book.copies === 0 ? "Currently Unavailable" : book.copies}
                      </span>
                    </p>

                    <button
                      onClick={() => handleIssueBook(book.id, book.copies)}
                      className={`mt-2 px-3 py-1 rounded text-white ${book.copies > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      disabled={book.copies === 0}
                    >
                      {book.copies > 0 ? "Issue Book" : "Unavailable"}
                    </button>

                    <button onClick={() => setSelectedBook(book)} className="mt-2 ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBooks;
