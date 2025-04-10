// ✅ BookRequestModal.jsx
import { motion } from "framer-motion";

export default function BookRequestModal({ setShowModal }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={setShowModal}
      />
      <motion.div
        className="fixed bg-gray-800 text-white p-6 rounded-xl shadow-lg w-[600px] z-50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">Requested Books</h3>
        <p className="text-gray-400">You have requested books. More UI can be added here.</p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
          onClick={setShowModal}
        >
          Close
        </button>
      </motion.div>
    </>
  );
}