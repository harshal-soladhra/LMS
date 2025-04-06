import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import NavbarBooks from "../components/NavbarBooks";

const Books = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [editionFilter, setEditionFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({ id: null });
  const [apiBooks, setApiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // ✅ Fetch User Data & Library Books
  useEffect(() => {
    const fetchUserAndLibraryBooks = async () => {
      const token = localStorage.getItem("supabase_token");
      if (token) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("🔥 Error fetching user:", userError?.message || "No user found");
          return;
        }
        setUser(user);
      }

      const { data: booksData, error: booksError } = await supabase.from("books").select("*");
      if (booksError) {
        console.error("🔥 Error fetching books:", booksError.message);
      } else {
        console.log("📚 Books fetched successfully:", booksData);
        setBooks(booksData);
      }
      setLoading(false);
    };
    fetchUserAndLibraryBooks();
  }, []);

  // ✅ Fetch Books from Open Library API with Pagination
  useEffect(() => {
    const fetchAPIbooks = async () => {
      setLoadingMore(true);
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=programming&limit=10&page=${page}&fields=key,title,author_name,language,edition_count,cover_i,first_publish_year,number_of_pages_median,subject`);
        const data = await response.json();

        if (data.docs.length === 0) {
          setLoadingMore(false);
          return;
        }

        const formattedBooks = data.docs.map((book, index) => ({
          id: `${book.key}-${index}`,
          title: book.title,
          author: book.author_name?.join(", ") || "Unknown",
          genre: "Unknown",
          language: book.language?.[0] || "Unknown",
          edition: book.edition_count || "Unknown",
          coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
          copies: 0,
          isExternal: true,
          firstPublishYear: book.first_publish_year || "Unknown",
          numberOfPages: book.number_of_pages_median || "Unknown",
          subjects: book.subject?.slice(0, 3).join(", ") || "Unknown",
        }));

        setApiBooks((prevBooks) => [...prevBooks, ...formattedBooks]);
      } catch (error) {
        console.error("🔥 Error fetching API books:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchAPIbooks();
  }, [page]);

  // ✅ Load More Books
  const loadMoreBooks = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // ✅ Merge Library Books & API Books
  const mergedBooks = [...books, ...apiBooks];

  // ✅ Filter Books
  const filteredBooks = mergedBooks.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (genreFilter === "" || book.genre === genreFilter) &&
      (languageFilter === "" || book.language === languageFilter) &&
      (editionFilter === "" || book.edition === editionFilter)
    );
  });

  // ✅ Handle Book Issue
  const handleIssueBook = async (bookId, copies) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("🔥 Error fetching user:", userError?.message || "No user found");
      alert("You must be logged in to issue a book.");
      navigate("/SignIn");
      return;
    }

    if (copies <= 0) {
      alert("Sorry, this book is currently unavailable.");
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    try {
      const { error } = await supabase
        .from("books")
        .update({
          issued_to: user.id,
          issued_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          copies: copies - 1,
        })
        .eq("id", bookId);

      if (error) throw error;
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          message: `You have successfully issued the book! Due date: ${dueDate.toDateString()}`,
        },
      ]);
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
          className="fixed top-20 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-600 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "⬅" : "➡"}
        </button>

        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <h1 className="text-2xl font-bold mb-4 mt-20">Library Books</h1>

          {/* Search & Filters */}
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search books..."
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
            <h2 className="text-xl font-semibold mb-2">Book Collection</h2>
            {loading ? (
              <p>Loading books...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className="p-4 bg-gray-100 shadow-md rounded-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                  >
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-600">Author: {book.author}</p>
                    <p className="text-sm text-gray-600">Genre: {book.genre}</p>
                    <p className="text-sm text-gray-600">Language: {book.language}</p>
                    <p className="text-sm text-gray-600">Edition: {book.edition}</p>
                    <p className="text-sm text-gray-600">Copies Available: {book.copies}</p>
                    <div className="flex gap-10">
                      {book.isExternal ? (
                        <button className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                          Request Book
                        </button>
                      ) : (
                        <button
                          onClick={() => handleIssueBook(book.id, book.copies)}
                          className={`mt-2 px-3 py-1 rounded text-white ${book.copies > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                          {book.copies > 0 ? "Issue Book" : "Out of Stock"}
                        </button>
                      )}
                      <div>
                        <button
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => setSelectedBook(book)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        {loadingMore && <p>Loading more books...</p>}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={loadMoreBooks}
        disabled={loadingMore}
      >
        {loadingMore ? "Loading..." : "Load More"}
      </button>

      {/* View Details Popup */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} // Faster animation
          >
            <motion.div
              className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row gap-4"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.2 }} // Faster animation
            >
              {/* Book Cover (Left Side) */}
              <div className="w-full md:w-1/3">
                {selectedBook.coverImage ? (
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="w-full h-64 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                    No Cover Available
                  </div>
                )}
              </div>

              {/* Book Details (Right Side) */}
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>Authors:</strong> {selectedBook.author}
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="ml-2 text-gray-600">115 reviews</span>
                </div>
                <p className="text-gray-600 mb-2">
                  <strong>First Published:</strong> {selectedBook.firstPublishYear}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Number of Pages:</strong> {selectedBook.numberOfPages}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Subjects:</strong> {selectedBook.subjects}
                </p>
                <p className="text-gray-600 mb-4">
                  Grimm's Complete Fairy Tales collects more than 200 tales set down by Jacob and Wilhelm Grimm in the early decades of the nineteenth century, among them some of the best-loved and most famous fairy tales in all literature: "Little Red Riding Hood," "Snow-White and the Seven Dwarfs," "Cinderella," "Sleeping Beauty," "Rapunzel," "Rumpelstiltskin," and "Tom Thumb." Voluminous and exhaustive, this collection ranges from the familiar to the obscure. First published in 1812-1815, the Brothers Grimm made a career of preserving and retelling these oral stories that in turn inspired generations of storytelling, both written and oral.
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setSelectedBook(null)}
                >
                  Cancel
                </button>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedBook(null)}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Books;