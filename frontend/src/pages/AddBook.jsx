import React, { useState } from "react";
import { addBook } from "../api"; // Import the function
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const [isbn, setIsbn] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddBook = async () => {
        if (!isbn) {
            alert("Please enter an ISBN number.");
            return;
        }

        setLoading(true);
        const response = await addBook(isbn);
        setLoading(false);

        alert(response.message);
        if (response.success) {
            navigate("/books");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Add a Book</h1>
            <input
                type="text"
                placeholder="Enter ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="border p-2 rounded mt-4"
            />
            <button
                onClick={handleAddBook}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading}
            >
                {loading ? "Adding..." : "Add Book"}
            </button>
        </div>
    );
};

export default AddBook;
