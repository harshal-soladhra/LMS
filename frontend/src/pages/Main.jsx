import { useState, useEffect } from "react";
import BookRequestModal from "../components/BookRequestModal";
import NewArrivals from "../components/NewArrivals";
import libraryBg from "../assets/Library-Management-Landing-Banner.jpg";
import "../style/Style.css";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient"; // Import Supabase client

const books = [
  { title: "Game Development", genre: "Programming" },
  { title: "Artificial Intelligence", genre: "Science" },
  { title: "Web Design Principles", genre: "Design" },
  { title: "Exploring Space", genre: "Science" },
  { title: "Epic Fantasy Tales", genre: "Fiction" },
  { title: "Cybersecurity Essentials", genre: "Technology" },
];

const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleBorrowBook = async (bookTitle) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to borrow a book.");
      return;
    }

    try {
      // ✅ Get logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = user.id;

      // ✅ Store borrowed book in Supabase
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

          {/* 🔍 Search Box */}
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

          {/* 📚 Category Buttons */}
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

      {/* Featured Books Carousel */}
      <section className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Featured Books</h2>
        <NewArrivals />
      </section>

      {/* How It Works */}
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

      {/* many books */}
      {
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
            {/* Book 1 */}
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
                <button className="btn-buy" onClick={() => handleBorrowBook(book.title)}>
                  Borrow
                </button>

              </div>
            </div>

            {/* Book 2 */}
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

            {/* Book 3 */}
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

            {/* Book 4 */}
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

            {/* Book 5 */}
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

            {/* Book 6 */}
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
      }

      {/* Book Request Modal */}
      {showModal && <BookRequestModal setShowModal={setShowModal} />}

      {/*best sellers*/}

      {/* Request Book Section */}
      <div className="text-center mt-10">
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          whileTap={{ scale: 0.9 }}
        >
          Request a Book
        </motion.button>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="about-container">

          {/* Text Section */}
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

          {/* Image Section */}
          <div className="img-section">
            <img src="src/assets/1-library-img.webp" alt="Library" />
          </div>

        </div>
      </div>



      {/* Testimonials Section */}
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
      {/* Footer Section */}
    </div>
  );
};

export default Main;
