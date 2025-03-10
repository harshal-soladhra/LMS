import { useState } from "react";
import BookRequestModal from "../components/BookRequestModal";
import NewArrivals from "../components/NewArrivals";
import libraryBg from "../assets/Library-Management-Landing-Banner.jpg";
<<<<<<< HEAD

const Main = () => {
  const [showModal, setShowModal] = useState(false);
=======
import "../style/Style.css";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";


const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
>>>>>>> 14881419a8a9679ab6e71a78ae39c6644e87f4f7

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
<<<<<<< HEAD
        className="w-full h-[400px] bg-cover bg-center relative flex flex-col justify-center items-center text-white text-center"
        style={{ backgroundImage: `url(${libraryBg})` }} // ✅ Corrected way to use image
      >
        {/* Overlay for better text visibility
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Welcome to Our Library</h1>
          <p className="mt-2 text-lg">
            Discover, Borrow, and Enjoy Books Anytime!
          </p>
        </div>
      </section>

      {/* About Library */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">50,000+ Books</h2>
          <p className="text-gray-600">
            Wide range of books across various genres.
          </p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">Digital Access</h2>
          <p className="text-gray-600">
            E-books & research papers available online.
          </p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold">Community Events</h2>
          <p className="text-gray-600">
            Workshops, book discussions, and more.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-blue-700">How It Works</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {["Search", "Borrow", "Read", "Return"].map((step, index) => (
            <div key={index} className="p-4 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Request Book Section */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Request a Book
        </button>
      </div>

      {/* Book Request Modal */}
      {showModal && <BookRequestModal setShowModal={setShowModal} />}
    </div>
=======
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
              <button className="btn-buy">Borrow</button>
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

      {/*best sellers*/ }

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

      

>>>>>>> 14881419a8a9679ab6e71a78ae39c6644e87f4f7
  );
};

export default Main;
