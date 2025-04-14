import { useState, useEffect } from "react";
import BookRequestModal from "../components/BookRequestModal";
import NewArrivals from "../components/NewArrivals";
import libraryBg from "../assets/Library-Management-Landing-Banner.jpg";
import "../style/Style.css";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import Reviews from "../components/reviews";
import { FaTimes } from "react-icons/fa"; // For cancel symbol

const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [show2025Popup, setShow2025Popup] = useState(false);
  const [show2024Popup, setShow2024Popup] = useState(false);
  const [topBooks2025, setTopBooks2025] = useState([]);
  const [topBooks2024, setTopBooks2024] = useState([]);

  const handleBorrowBook = async (bookTitle) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to borrow a book.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = user.id;

      const { data, error } = await supabase
        .from("borrowed_books")
        .insert([{ title: bookTitle, user_id: userId }]);

      if (error) throw error;

      alert(`You have successfully borrowed "${bookTitle}"!`);
    } catch (err) {
      alert("Failed to borrow the book. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  // Simulated API fetch for top books of 2025
  useEffect(() => {
    const fetchTopBooks2025 = async () => {
      // Replace with real API call, e.g., Google Books API
      const dummyData2025 = [
        { id: 1, title: "Future Worlds", author: "A. Smith", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL1W" },
        { id: 2, title: "Intermezzo", author: "Sally Rooney", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL2W" },
        { id: 3, title: "Quantum Leap", author: "C. Lee", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL3W" },
        { id: 4, title: "AI Revolution", author: "D. Kim", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL4W" },
        { id: 5, title: "Space Chronicles", author: "E. Brown", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL5W" },
        { id: 6, title: "Digital Dreams", author: "F. Davis", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL6W" },
        { id: 7, title: "Eco Futures", author: "G. Wilson", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL7W" },
        { id: 8, title: "Code & Conquer", author: "H. Taylor", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL8W" },
        { id: 9, title: "Beyond Stars", author: "I. Clark", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL9W" },
        { id: 10, title: "Next Horizon", author: "J. Moore", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL10W" },
      ];
      setTopBooks2025(dummyData2025);
    };

    const fetchTopBooks2024 = async () => {
      // Replace with real API call
      const dummyData2024 = [
        { id: 1, title: "Past Promises", author: "K. Adams", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL11W" },
        { id: 2, title: "Code Legacy", author: "L. Evans", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL12W" },
        { id: 3, title: "Time Shift", author: "M. Garcia", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL13W" },
        { id: 4, title: "Data Dawn", author: "N. Patel", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL14W" },
        { id: 5, title: "Sky Limits", author: "O. White", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL15W" },
        { id: 6, title: "Cyber Echoes", author: "P. Green", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL16W" },
        { id: 7, title: "Green Tech", author: "Q. Harris", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL17W" },
        { id: 8, title: "Web Wonders", author: "R. King", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL18W" },
        { id: 9, title: "Star Paths", author: "S. Lopez", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL19W" },
        { id: 10, title: "Last Frontier", author: "T. Young", image: "https://via.placeholder.com/150", link: "https://openlibrary.org/works/OL20W" },
      ];
      setTopBooks2024(dummyData2024);
    };

    fetchTopBooks2025();
    fetchTopBooks2024();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="w-full h-[600px] bg-cover bg-center relative flex flex-col justify-center items-center text-white text-center overflow-hidden"
        style={{ backgroundImage: `url(${libraryBg})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-bold drop-shadow-lg">Welcome to Our Library</h1>
          <p className="mt-2 text-lg">Discover, Borrow, and Enjoy Books Anytime!</p>

          <div className="mt-6 flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md w-80 mx-auto">
            <FaSearch className="mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search for books..."
              className="w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <button className="category-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setSearchQuery("Programming")}
            >
              Programming
            </button>
            <button className="category-btn bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => setSearchQuery("Design")}
            >
              Design
            </button>
            <button className="category-btn bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              onClick={() => setSearchQuery("Science")}
            >
              Science
            </button>
            <button className="category-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => setSearchQuery("Fiction")}
            >
              Fiction
            </button>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Featured Books</h2>
        <NewArrivals />
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold text-blue-700">How It Works</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Search", "Borrow", "Read", "Return"].map((step, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg"
              whileHover={{ scale: 1.1 }}
            >
              <h3 className="text-lg font-semibold text-blue-600">{step}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="books-section">
        <h2 className="section-title">Explore Our Categories</h2>
        <div className="categories">
          <button className="category-btn">Programming</button>
          <button className="category-btn">Design</button>
          <button className="category-btn">Science</button>
          <button className="category-btn">Fiction</button>
          <button className="category-btn">History</button>
          <button className="category-btn">Technology</button>
        </div>
        <div className="books-grid">
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/1-gaming-book.webp" alt="gaming-book" />
            </div>
            <div className="book-text">
              <h3>Game Development</h3>
              <p>Learn how to develop games using Unity and Unreal Engine.</p>
              <p>Author: John Doe</p>
              <p>Published: 2021</p>
            </div>
            <div className="buttons">
              <button className="btn-buy" onClick={() => handleBorrowBook("Game Development")}>
                Borrow
              </button>
            </div>
          </div>
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/2-ai-book.webp" alt="AI book" />
            </div>
            <div className="book-text">
              <h3>Artificial Intelligence</h3>
              <p>Understand AI concepts and machine learning.</p>
              <p>Author: Jane Smith</p>
              <p>Published: 2022</p>
            </div>
            <div className="buttons">
              <button className="btn-buy">Borrow</button>
            </div>
          </div>
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/3-web-design-principle-book.webp" alt="Web Design book" />
            </div>
            <div className="book-text">
              <h3>Web Design Principles</h3>
              <p>Master UI/UX design for modern websites.</p>
              <p>Author: Alice Brown</p>
              <p>Published: 2020</p>
            </div>
            <div className="buttons">
              <button className="btn-buy">Borrow</button>
            </div>
          </div>
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/4-space-book.webp" alt="Space book" />
            </div>
            <div className="book-text">
              <h3>Exploring Space</h3>
              <p>A journey through the cosmos and beyond.</p>
              <p>Author: Carl Johnson</p>
              <p>Published: 2019</p>
            </div>
            <div className="buttons">
              <button className="btn-buy">Borrow</button>
            </div>
          </div>
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/5-fiction-book.webp" alt="Fiction book" />
            </div>
            <div className="book-text">
              <h3>Epic Fantasy Tales</h3>
              <p>Immerse yourself in thrilling fantasy worlds.</p>
              <p>Author: Mark Wilson</p>
              <p>Published: 2023</p>
            </div>
            <div className="buttons">
              <button className="btn-buy">Borrow</button>
            </div>
          </div>
          <div className="box-books">
            <div className="book-img">
              <img src="src/assets/6-cyber-book.webp" alt="Cybersecurity book" />
            </div>
            <div className="book-text">
              <h3>Cybersecurity Essentials</h3>
              <p>Protect yourself in the digital age.</p>
              <p>Author: Emily Roberts</p>
              <p>Published: 2021</p>
            </div>
            <div className="buttons">
              <button className="btn-buy">Borrow</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <BookRequestModal setShowModal={setShowModal} />}

      <div className="best-sellers flex flex-col md:flex-row justify-center items-center gap-10 p-10 bg-gray-100 ml-60">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="img-part-1 relative w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lgmx-auto md:mx-0"
        >
          <img
            src="src/assets/arivals-img/1-best-2025.jpeg"
            alt="Library"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-part-1 w-full md:w-1/2 text-center md:text-left space-y-4 mx-auto md:mx-0"
        >
          <h2 className="text-3xl font-bold text-gray-800">New Year, New Books!</h2>
          <p className="text-gray-600 text-lg">
            Get your reading list ahead of the curve <br />
            and be the first to request these 25 must-read <br /> books 
            everyone will be talking about in 2025.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => setShow2025Popup(true)}
          >
            VIEW DETAILS
          </motion.button>
        </motion.div>
      </div>

      <hr className="w-1/2 border-t-2 border-gray-300 my-4 mx-auto" />

      <div className="best-sellers flex flex-col md:flex-row justify-center items-center gap-10 p-10 bg-gray-100 ml-60">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          className="img-part-1 relative w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lgmx-auto md:mx-0"
        >
          <img
            src="src/assets/arivals-img/1-best-2024.jpeg"
            alt="Library"
            className="w-full h-full object-cover rounded-2xl transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-part-1 w-full md:w-1/2 text-center md:text-left space-y-4 mx-auto md:mx-0"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Check Out <br />
            All the Best Books of 2024
          </h2>
          <p className="text-gray-600 text-lg">
            As we near the end of 2024, there are so many <br /> wonderful books to look back on—and still more <br />to come. To make things easy, we’ve compiled <br /> some  of the Best Books and Audiobooks of the <br /> Year lists to take the guess work  out of finding <br /> your next great read(s).
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            onClick={() => setShow2024Popup(true)}
          >
            VIEW DETAILS
          </motion.button>
        </motion.div>
      </div>

      {/* Popup for Top Books 2025 */}
      <AnimatePresence>
        {show2025Popup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow2025Popup(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-11/12 max-w-5xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Top 10 Books of 2025</h2>
                <button onClick={() => setShow2025Popup(false)} className="text-gray-600 hover:text-gray-800">
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {topBooks2025.map((book, index) => (
                  <motion.div
                    key={book.id}
                    className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={book.image} alt={book.title} className="w-24 h-36 object-cover rounded-md mb-2" />
                    <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      View More
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Popup for Top Books 2024 */}
      <AnimatePresence>
        {show2024Popup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow2024Popup(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50 w-11/12 max-w-5xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Top 10 Books of 2024</h2>
                <button onClick={() => setShow2024Popup(false)} className="text-gray-600 hover:text-gray-800">
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {topBooks2024.map((book, index) => (
                  <motion.div
                    key={book.id}
                    className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={book.image} alt={book.title} className="w-24 h-36 object-cover rounded-md mb-2" />
                    <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      View More
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="text-center mt-10">
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          whileTap={{ scale: 0.9 }}
        >
          Request a Book
        </motion.button>
      </div>

      <div className="about-section">
        <div className="about-container">
          <div className="text-section">
            <h2>About Our Library</h2>
            <p>
              Our library is a place of knowledge and discovery, offering a variety of resources
              for students, researchers, and book lovers.
            </p>
            <h4>📚 Extensive Book Collection</h4>
            <p>We house thousands of books across different genres, academic fields, and interests.</p>
            <h4>💻 Digital Resources</h4>
            <p>Access e-books, research papers, and digital archives with our online library services.</p>
            <h4>☕ Peaceful Reading Spaces</h4>
            <p>Enjoy quiet and comfortable spaces for reading, studying, or working on assignments.</p>
            <h4>🎓 Student & Research Assistance</h4>
            <p>Our librarians provide guidance in research, citations, and resource recommendations.</p>
            <h4>📶 Free Wi-Fi & Computer Access</h4>
            <p>Stay connected with high-speed internet and dedicated workstations for students.</p>
          </div>
          <div className="img-section">
            <img src="src/assets/1-library-img.webp" alt="Library" />
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <section className="reviews-grid">
          <div className="review-card">
            <div className="person-img">
              <img src="src/assets/reiview-person/1-img.webp" alt="person1" />
            </div>
            <div className="review-text">
              <h3>John Doe</h3>
              <p>"The library has a great collection of books. I love the service!"</p>
            </div>
          </div>
          <div className="review-card">
            <div className="person-img">
              <img src="src/assets/reiview-person/2-img.webp" alt="person2" />
            </div>
            <div className="review-text">
              <h3>Eva Lichi</h3>
              <p>"Amazing atmosphere and very helpful staff. Highly recommended!"</p>
            </div>
          </div>
          <div className="review-card">
            <div className="person-img">
              <img src="src/assets/reiview-person/3-img.webp" alt="person3" />
            </div>
            <div className="review-text">
              <h3>Robert Brown</h3>
              <p>"A quiet and perfect place to study. Best library in town!"</p>
            </div>
          </div>
        </section>
      </div>

      <Reviews />
    </div>
  );
};

export default Main;