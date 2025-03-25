import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavbarBooks from "../components/NavbarBooks";
import Footer from "../components/Footer";

const AvailableBooks = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [editionFilter, setEditionFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    { title: "Detective Agency", author: "John Doe", genre: "Fiction", language: "English", edition: "1st", year: "2020", pages: 320, publisher: "ABC Publications", readLink: "https://www.google.com", copies: 5 },
    { title: "The Fault in Our Stars", author: "Jane Smith", genre: "Mystery", language: "Spanish", edition: "2nd", year: "2018", pages: 250, publisher: "XYZ Press", readLink: "https://www.google.com", copies: 2 },
    { title: "Harry Potter and the Sorcerer's Stone", author: "Alice Johnson", genre: "Science", language: "French", edition: "1st", year: "2022", pages: 400, publisher: "Science World", readLink: "https://www.google.com", copies: 6 },
    { title: "Big Magic", author: "Michael Brown", genre: "History", language: "English", edition: "3rd", year: "2015", pages: 300, publisher: "Penguin Books", readLink: "https://www.google.com", copies: 1 }
  ];

  const filteredBooks = books.filter((book) => {
    return (
      book.copies >= 1 &&
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (genreFilter === "" || book.genre === genreFilter) &&
      (languageFilter === "" || book.language === languageFilter) &&
      (editionFilter === "" || book.edition === editionFilter)
    );
  });

  const handleIssueBook = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/SignIn");
    } else {
      alert("Book issued successfully!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className={`fixed top-16 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          {sidebarOpen && <NavbarBooks />}
        </div>

        <button className="fixed top-20 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 z-50" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "⬅" : "➡"}
        </button>

        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <h1 className="text-2xl font-bold mb-4 mt-20">Available Books</h1>

          <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center gap-4">
            <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
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

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Book Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book, index) => (
                <div key={index} className="p-4 bg-gray-100 shadow-md rounded-lg">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">Author: {book.author}</p>
                  <p className="text-sm text-gray-600">Genre: {book.genre}</p>
                  <p className="text-sm text-gray-600">Language: {book.language}</p>
                  <p className="text-sm text-gray-600">Edition: {book.edition}</p>
                  <button onClick={handleIssueBook} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Issue Book</button>
                  <button onClick={() => setSelectedBook(book)} className="mt-2 ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">View Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBooks;
