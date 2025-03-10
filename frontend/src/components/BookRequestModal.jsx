<<<<<<< HEAD
const BookRequestModal = ({ setShowModal }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold text-center">Request a Book</h2>
          <input type="text" placeholder="Book Name" className="border p-2 w-full mt-2" />
          <input type="text" placeholder="Author" className="border p-2 w-full mt-2" />
          <input type="text" placeholder="Edition" className="border p-2 w-full mt-2" />
          <input type="text" placeholder="Category" className="border p-2 w-full mt-2" />
          <button
            onClick={() => setShowModal(false)}
            className="bg-blue-600 text-white px-4 py-2 w-full mt-4 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };
  
  export default BookRequestModal;
  
=======
import { motion } from "framer-motion";
import { useState } from "react";

const BookRequestModal = ({ setShowModal }) => {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [category, setCategory] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      {/* Modal Container */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-96 relative border border-white/20"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ rotate: 90, scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold transition"
        >
          &times;
        </motion.button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">📖 Request a Book</h2>

        {/* Input Fields with Floating Labels */}
        <div className="mt-5 space-y-4">
          {[
            { label: "Book Name", state: bookName, setState: setBookName },
            { label: "Author", state: author, setState: setAuthor },
            { label: "Edition", state: edition, setState: setEdition },
            { label: "Category", state: category, setState: setCategory },
          ].map(({ label, state, setState }, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="peer border border-gray-300 p-3 w-full rounded-lg bg-transparent outline-none focus:border-blue-500 transition"
              />
              <label
                className={`absolute left-3 top-3 text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500`}
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        {/* Submit Button with Animation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(false)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 w-full mt-6 rounded-xl shadow-lg hover:shadow-xl transition transform"
        >
          Submit Request
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookRequestModal;
>>>>>>> 14881419a8a9679ab6e71a78ae39c6644e87f4f7
