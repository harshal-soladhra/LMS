import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // adjust if needed
import { motion, AnimatePresence } from "framer-motion";
import NavbarBooks from "../components/NavbarBooks"; // adjust if needed

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [editionFilter, setEditionFilter] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  const fetchIssuedBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("issued_books")
        .select("id, book_title, issue_date, return_date")
        .order("issue_date", { ascending: false });

      if (error) {
        console.error("Error fetching issued books:", error.message);
        setIssuedBooks([]);
        setFilteredBooks([]);
      } else {
        console.log("Fetched issued books:", data);
        setIssuedBooks(data || []);
        setFilteredBooks(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching issued books:", err);
      setIssuedBooks([]);
      setFilteredBooks([]);
    }
    setLoading(false);
  };

  const handleReserveBook = (id) => {
    console.log(`Reserving book with id ${id}`);
    setSuccessPopup(true);
    setTimeout(() => setSuccessPopup(false), 2000); // Auto-close after 2 seconds
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  useEffect(() => {
    let filtered = issuedBooks;

    if (search) {
      filtered = filtered.filter((book) =>
        book.book_title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [search, issuedBooks]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.div
          className={`fixed top-16 left-0 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 z-50`}
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {sidebarOpen && <NavbarBooks />}
        </motion.div>

        <motion.button
          className="fixed top-20 left-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarOpen ? "⬅" : "➡"}
        </motion.button>

        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <motion.h2
            className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            📚 Issued Books
          </motion.h2>

          {/* Search & Filters */}
          <motion.div
            className="mt-4 p-4 bg-white/10 backdrop-blur-md shadow-lg rounded-lg flex flex-col md:flex-row items-center gap-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search books by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-md w-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </motion.div>

          {/* Book Grid */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {loading ? (
              <p className="text-center text-gray-300">Loading issued books...</p>
            ) : filteredBooks.length === 0 ? (
              <p className="text-center text-gray-300">No books issued.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className="p-4 bg-white/10 backdrop-blur-md shadow-lg rounded-lg border border-white/20"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * filteredBooks.indexOf(book) }}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)" }}
                  >
                    <h3 className="font-semibold text-lg text-white">{book.book_title}</h3>
                    <p className="text-sm text-gray-300">Issued: {new Date(book.issue_date).toDateString()}</p>
                    <p className="text-sm text-gray-300">Due: {new Date(book.return_date).toDateString()}</p>
                    <div className="flex gap-4 mt-3">
                      <motion.button
                        onClick={() => handleReserveBook(book.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reserve a Book
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {successPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuccessPopup(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-xl shadow-2xl z-50 border border-white/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Success</h3>
              <p className="mb-4">Book reserved successfully!</p>
              <motion.button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 w-full"
                onClick={() => setSuccessPopup(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssuedBooks;