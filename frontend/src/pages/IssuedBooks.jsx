import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // adjust if needed
import { motion } from "framer-motion";
import NavbarBooks from "../components/NavbarBooks"; // adjust if needed

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchIssuedBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("issued_books")
      .select("id, book_title, issue_date, return_date")
      .order("issue_date", { ascending: false });

    if (error) {
      console.error("Error fetching issued books:", error);
    } else {
      setIssuedBooks(data);
    }

    setLoading(false);
  };

  const handleReturn = async (id) => {
    const { error } = await supabase.from("issued_books").delete().eq("id", id);
    if (error) {
      alert("Failed to return book.");
      console.error(error);
    } else {
      setIssuedBooks((prev) => prev.filter((book) => book.id !== id));
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

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
          <h2 className="text-3xl font-bold mb-6 text-center">📚 Issued Books</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading issued books...</p>
          ) : issuedBooks.length === 0 ? (
            <p className="text-center text-gray-500">No books issued.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {issuedBooks.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ scale: 1.03 }}
                  className="border border-gray-300 rounded-xl p-5 bg-white shadow-md"
                >
                  <h3 className="text-xl font-semibold">{book.book_title}</h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-600">Issued: {new Date(book.issue_date).toDateString()}</p>
                  <p className="text-sm text-gray-600">Due: {new Date(book.due_date).toDateString()}</p>

                  <button
                    onClick={() => handleReturn(book.id)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Return Book
                  </button>
                </motion.div>
              ))}
            </div>
            </div>
  );
};
export default IssuedBooks;
