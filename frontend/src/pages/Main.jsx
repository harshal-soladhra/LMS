import { useState } from "react";
import BookRequestModal from "../components/BookRequestModal";
import NewArrivals from "../components/NewArrivals";
import libraryBg from "../assets/Library-Management-Landing-Banner.jpg";

const Main = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
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
  );
};

export default Main;