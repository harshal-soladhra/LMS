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
  