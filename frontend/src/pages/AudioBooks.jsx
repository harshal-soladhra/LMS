import React from "react";
import NavbarBooks from "../components/NavbarBooks";

const AudioBooks = () => {
  return (
    <div className="mt-30 p-5">
      <NavbarBooks />
      
      <h1 className="text-3xl font-bold text-center mt-5">🎧 Audio Books Section</h1>
      <p className="text-center text-gray-600">Listen to a collection of audio books.</p>
    </div>
  );
};

export default AudioBooks;
