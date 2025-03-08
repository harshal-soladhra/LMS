import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPhoto, setUserPhoto] = useState(localStorage.getItem("userPhoto") || "https://via.placeholder.com/150");
  const [books, setBooks] = useState([]); // ✅ Store real books
  const [activePage, setActivePage] = useState("issuedBooks");
  const [currentPage, setCurrentPage] = useState(1);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const photoUrl = e.target.result;
            setUserPhoto(photoUrl);
            localStorage.setItem("userPhoto", photoUrl); // ✅ Save to local storage
        };

        reader.readAsDataURL(file);
    }
};


  useEffect(() => {
    const fetchProfileAndBooks = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found! Redirecting to Sign In...");
            navigate("/signin", { replace: true });
            return;
        }

        try {
            // ✅ Fetch User Profile
            const userResponse = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(userResponse.data);

            // ✅ Fetch Books Issued to User
            const booksResponse = await axios.get("http://localhost:5000/api/books/issued", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(booksResponse.data);
        } catch (err) {
            console.error("Profile/Books Fetch Error:", err);
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
        } finally {
            setLoading(false);
        }
    };

    fetchProfileAndBooks();
}, [navigate]);


  const booksPerPage = 5;
  const getCurrentBooks = () => {
    let filteredBooks = books;
    if (activePage === "returnedBooks") {
      filteredBooks = books.filter((book) => book.returned_date);
    } else if (activePage === "dueDate") {
      filteredBooks = books.filter((book) => !book.returned_date);
    }
    return filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);
  };

  const totalPages = Math.ceil(
    (activePage === "returnedBooks"
      ? books.filter((book) => book.returned_date).length
      : activePage === "dueDate"
      ? books.filter((book) => !book.returned_date).length
      : books.length) / booksPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const getPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <img src={userPhoto} alt="User Photo" className="w-full h-full object-cover rounded-full" />
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photoInput" />
            <label htmlFor="photoInput" className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full text-sm cursor-pointer">
              📷
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.role}</p>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setActivePage("issuedBooks");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activePage === "issuedBooks" ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105"
            }`}
          >
            📚 Issued Books
          </button>
          <button
            onClick={() => {
              setActivePage("returnedBooks");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activePage === "returnedBooks" ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105"
            }`}
          >
            📅 Returned Books
          </button>
          <button
            onClick={() => {
              setActivePage("dueDate");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activePage === "dueDate" ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105"
            }`}
          >
            ⚠️ Due Date
          </button>
        </div>

        {/* Book List */}
        <div className="mt-6 w-full min-h-[calc(100vh-300px)] flex flex-col bg-gray-50 rounded-lg p-4">
          {getCurrentBooks().map((book) => (
            <div key={book.id} className="p-4 mb-4 border rounded-lg shadow-sm bg-white flex justify-between">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Issued Date:</strong> {book.issued_date} | <strong>Due Date:</strong> {book.due_date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;