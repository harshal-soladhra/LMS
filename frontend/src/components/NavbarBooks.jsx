import React from "react";
import { Link } from "react-router-dom";

const NavbarBooks = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 p-6">
      <h2 className="text-xl font-bold mb-6">Library Menu</h2>
      <ul className="space-y-4">
        <li><Link to="/books" className="block hover:text-blue-400">📚 All Books</Link></li>
        <li><Link to="/available-books" className="block hover:text-blue-400">✅ Available Books</Link></li>
        <li><Link to="/issued-books" className="block hover:text-blue-400">📖 Issued Books</Link></li>
        <li><Link to="/reservations" className="block hover:text-blue-400">🔖 Reservations</Link></li>
        <li><Link to="/history" className="block hover:text-blue-400">📜 History</Link></li>
      </ul>
    </div>
  );
};

export default NavbarBooks;
