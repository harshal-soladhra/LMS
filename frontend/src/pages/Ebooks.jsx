import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import NavbarBooks from "../components/NavbarBooks";

const Ebooks = () => {
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
  const [isReadingPopupOpen, setIsReadingPopupOpen] = useState(false);
  const [currentReadingBook, setCurrentReadingBook] = useState(null);

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
        setBooks(booksData);
      }
      setLoading(false);
    };
    fetchUserAndLibraryBooks();
  }, []);

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
          key: book.key,
          bookUrl: `https://openlibrary.org${book.key}`,
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

  const loadMoreBooks = () => setPage((prevPage) => prevPage + 1);

  const mergedBooks = [...books, ...apiBooks];
  const filteredBooks = mergedBooks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) &&
    (genreFilter === "" || book.genre === genreFilter) &&
    (languageFilter === "" || book.language === languageFilter) &&
    (editionFilter === "" || book.edition === editionFilter)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div className={`fixed top-16 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          {sidebarOpen && <NavbarBooks />}
        </div>
        <button className="fixed top-20 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-600 z-50" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "⬅" : "➡"}
        </button>
        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <h1 className="text-3xl font-bold mb-5 mt-20">E-Books</h1>
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex space-x-3">
              <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">ALL GENRES</option>
                <option value="Fiction">Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Science">Science</option>
              </select>
              <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">ALL LANGUAGES</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
              <select value={editionFilter} onChange={(e) => setEditionFilter(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">ALL EDITIONS</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-5">Book Collection</h2>
            {loading ? (
              <p className="text-gray-600">Loading books...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <motion.div key={book.id} className="p-5 bg-white shadow-lg rounded-lg flex flex-col justify-between" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
                    <div>
                      <h3 className="text-xl font-bold">{book.title}</h3>
                      <p className="text-gray-600">Author: {book.author}</p>
                      <p className="text-gray-600">Genre: {book.genre}</p>
                      <p className="text-gray-600">Language: {book.language}</p>
                      <p className="text-gray-600">Edition: {book.edition}</p>
                    </div>
                    <div className="flex justify-between mt-4 space-x-2">
                      {book.isExternal ? (
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={() => { setCurrentReadingBook(book); setIsReadingPopupOpen(true); }}>Read Book</button>
                      ) : (
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => { setCurrentReadingBook(book); setIsReadingPopupOpen(true); }}>Read Book</button>
                      )}
                      <button onClick={() => setSelectedBook(book)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View Details</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center mt-6">
            {loadingMore ? (
              <p className="text-gray-600">Loading more books...</p>
            ) : (
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={loadMoreBooks} disabled={loadingMore}>Load More</button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedBook && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <motion.div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full flex flex-col md:flex-row gap-4" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} transition={{ duration: 0.2 }}>
              <div className="w-full md:w-1/3">
                {selectedBook.coverImage ? (
                  <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-full h-64 object-cover rounded" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded"><p className="text-gray-600">NO COVER AVAILABLE</p></div>
                )}
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-gray-600 mb-2"><strong>Authors:</strong> {selectedBook.author}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 flex">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                  </span>
                  <span className="ml-2 text-gray-600">115 reviews</span>
                </div>
                <p className="text-gray-600 mb-2"><strong>First Published:</strong> {selectedBook.firstPublishYear}</p>
                <p className="text-gray-600 mb-2"><strong>Number of Pages:</strong> {selectedBook.numberOfPages}</p>
                <h4 className="text-lg font-semibold mb-2">Subjects:</h4>
                <p className="text-gray-600 mb-4">{selectedBook.subjects}</p>
                <p className="text-gray-600 mb-4">{selectedBook.description || "Grimm's Complete Fairy Tales collects more than 200 tales set down by Jacob and Wilhelm Grimm in the early decades of the nineteenth century, among them some of the best-loved and most famous fairy tales in all literature: 'Little Red Riding Hood,' 'Snow-White and the Seven Dwarfs,' 'Cinderella,' 'Sleeping Beauty,' 'Rapunzel,' 'Rumpelstiltskin,' and 'Tom Thumb.' Voluminous and exhaustive, this collection ranges from the familiar to the obscure. First published in 1812-1815, the Brothers Grimm made a career of preserving and retelling these oral stories that in turn inspired generations of storytelling, both written and oral."}</p>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setSelectedBook(null)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isReadingPopupOpen && currentReadingBook && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <motion.div className="bg-white p-6 rounded-lg shadow-lg w-full h-full m-4 flex flex-col" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} transition={{ duration: 0.2 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{currentReadingBook.title}</h2>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => { setIsReadingPopupOpen(false); setCurrentReadingBook(null); }}>Close</button>
              </div>
              <div className="flex-1 w-full h-full">
                <iframe src={currentReadingBook.bookUrl || `https://openlibrary.org${currentReadingBook.key}`} title={currentReadingBook.title} className="w-full h-full border-none" allowFullScreen>Your browser doesn't support iframes</iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ebooks;