import { useState } from "react";
<<<<<<< HEAD

const booksData = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", edition: "1st", category: "Fiction" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", edition: "2nd", category: "Classic" },
  { id: 3, title: "1984", author: "George Orwell", edition: "3rd", category: "Dystopian" },
  { id: 4, title: "Moby Dick", author: "Herman Melville", edition: "1st", category: "Adventure" },
  { id: 5, title: "War and Peace", author: "Leo Tolstoy", edition: "5th", category: "Historical" },
  { id: 6, title: "Pride and Prejudice", author: "Jane Austen", edition: "4th", category: "Romance" },
  { id: 7, title: "Hamlet", author: "William Shakespeare", edition: "3rd", category: "Drama" },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", edition: "1st", category: "Fantasy" },
];

const NewArrivals = () => {
  const [page, setPage] = useState(1);
  const booksPerPage = 6;

  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = booksData.slice(startIndex, endIndex);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center text-blue-700">New Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {currentBooks.map((book) => (
          <div key={book.id} className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.author} | {book.edition} Edition</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded-l-md hover:bg-gray-400 transition disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={endIndex >= booksData.length}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded-r-md hover:bg-gray-400 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
=======
import img1 from "../assets/arivals-img/1-img.webp";
import img2 from "../assets/arivals-img/2-img.jpeg";
import img3 from "../assets/arivals-img/3-img.webp";
import img4 from "../assets/arivals-img/4-img.webp";
import img5 from "../assets/arivals-img/5-img.webp";
import img6 from "../assets/arivals-img/6-img.webp";
import img7 from "../assets/arivals-img/7-img.webp";
import img8 from "../assets/arivals-img/8-img.webp";
import img9 from "../assets/arivals-img/9-img.webp";

const booksData = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", edition: "1st", category: "Fiction", image: img1 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", edition: "2nd", category: "Classic", image: img2 },
  { id: 3, title: "1984", author: "George Orwell", edition: "3rd", category: "Dystopian", image: img3},
  { id: 4, title: "Moby Dick", author: "Herman Melville", edition: "1st", category: "Adventure", image: img4 },
  { id: 5, title: "War and Peace", author: "Leo Tolstoy", edition: "5th", category: "Historical", image: img5 },
  { id: 6, title: "Pride and Prejudice", author: "Jane Austen", edition: "4th", category: "Romance", image: img6 },
  { id: 7, title: "Hamlet", author: "William Shakespeare", edition: "3rd", category: "Drama", image: img7 },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", edition: "1st", category: "Fantasy", image: img8 },
  { id: 9, title: "The Catcher in the Rye", author: "J.D. Salinger", edition: "2nd", category: "Classic", image: img9 },
];

const NewArrivals = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center text-blue-700">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {booksData.map((book) => (
          <div key={book.id} className="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center">
            <img src={book.image} alt={book.title} className="w-32 h-40 object-cover rounded-md mb-3" />
            <h3 className="text-lg font-semibold text-center">{book.title}</h3>
            <p className="text-gray-600 text-center">{book.author} | {book.edition} Edition</p>
          </div>
        ))}
      </div>
>>>>>>> 14881419a8a9679ab6e71a78ae39c6644e87f4f7
    </section>
  );
};

<<<<<<< HEAD
export default NewArrivals;
=======
export default NewArrivals;
>>>>>>> 14881419a8a9679ab6e71a78ae39c6644e87f4f7
