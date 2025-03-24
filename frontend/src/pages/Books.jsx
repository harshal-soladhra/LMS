import React, { useState } from "react";
import NavbarBooks from "../components/NavbarBooks"; // Import NavbarBooks
import Footer from "../components/Footer"; // Import Footer

const Books = () => {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar Component */}
        <div
          className={`fixed top-16 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          {sidebarOpen && <NavbarBooks />}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className="fixed top-20 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-600 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "⬅" : "➡"}
        </button>

        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <h1 className="text-2xl font-bold mb-4 mt-20">Library Books</h1>
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => console.log("Searching for:", search)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              🔍 Search
            </button>
          </div>

          {/* Books List Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Book Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                <h3 className="font-semibold">Book Title 1</h3>
                <p className="text-sm text-gray-600">Author: John Doe</p>
                <p className="text-sm text-gray-600">Genre: Fiction</p>
                <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Reserve
                </button>
              </div>
              <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                <h3 className="font-semibold">Book Title 2</h3>
                <p className="text-sm text-gray-600">Author: Jane Smith</p>
                <p className="text-sm text-gray-600">Genre: Mystery</p>
                <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Books;
