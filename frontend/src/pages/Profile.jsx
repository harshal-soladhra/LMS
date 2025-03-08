import { useState, useEffect } from 'react'; 

 

function Profile() { 

  const [userPhoto, setUserPhoto] = useState(() => { 

    return localStorage.getItem('userPhoto') || 'https://via.placeholder.com/150'; 

  }); 

  const [activePage, setActivePage] = useState('issuedBooks'); 

  const [currentPage, setCurrentPage] = useState(1); 

 

  const handlePhotoChange = (e) => { 

    const file = e.target.files[0]; 

    if (file) { 

      const reader = new FileReader(); 

      reader.onload = (e) => { 

        const photoUrl = e.target.result; 

        setUserPhoto(photoUrl); 

        localStorage.setItem('userPhoto', photoUrl); 

      }; 

      reader.readAsDataURL(file); 

    } 

  }; 

 

  const books = Array.from({ length: 75 }, (_, index) => ({ 

    id: index + 1, 

    title: `Book ${index + 1}`, 

    issuedDate: '2023-10-10', 

    dueDate: '2023-11-10', 

    returnedDate: index % 2 === 0 ? '2023-11-01' : null, 

    status: index % 2 === 0 ? 'Returned' : 'Pending' 

  })); 

 

  const booksPerPage = 5; 

 

  const getCurrentBooks = () => { 

    let filteredBooks = books; 

 

    if (activePage === 'returnedBooks') { 

      filteredBooks = books.filter((book) => book.status === 'Returned'); 

    } else if (activePage === 'dueDate') { 

      filteredBooks = books.filter((book) => book.status === 'Pending'); 

    } 

 

    return filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage); 

  }; 

 

  const totalPages = Math.ceil( 

    (activePage === 'returnedBooks' 

      ? books.filter((book) => book.status === 'Returned').length 

      : activePage === 'dueDate' 

      ? books.filter((book) => book.status === 'Pending').length 

      : books.length) / booksPerPage 

  ); 

 

  const handlePageChange = (page) => { 

    setCurrentPage(page); 

  }; 

 

  const getPagination = () => { 

    const pages = []; 

 

    if (totalPages <= 5) { 

      for (let i = 1; i <= totalPages; i++) { 

        pages.push(i); 

      } 

    } else { 

      pages.push(1, 2, 3); 

 

      if (currentPage > 4) pages.push('...'); 

 

      const start = Math.max(4, currentPage - 1); 

      const end = Math.min(totalPages - 1, currentPage + 1); 

 

      for (let i = start; i <= end; i++) { 

        pages.push(i); 

      } 

 

      if (currentPage < totalPages - 3) pages.push('...'); 

 

      pages.push(totalPages); 

    } 

 

    return pages; 

  }; 

 

  return ( 

    <div className="min-h-screen w-full bg-gray-100 p-4 flex justify-center items-center"> 

      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl"> 

        <div className="flex items-center gap-6"> 

          <div className="relative w-32 h-32"> 

            <img 

              src={userPhoto} 

              alt="User Photo" 

              className="w-full h-full object-cover rounded-full" 

            /> 

            <input 

              type="file" 

              accept="image/*" 

              onChange={handlePhotoChange} 

              className="hidden" 

              id="photoInput" 

            /> 

            <label 

              htmlFor="photoInput" 

              className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full text-sm cursor-pointer" 

            > 

              📷 

            </label> 

          </div> 

 

          <div> 

            <h2 className="text-2xl font-semibold">Krish Dhamecha</h2> 

            <p className="text-gray-600">User Type</p> 

          </div> 

        </div> 

 

        <div className="mt-8 flex flex-wrap gap-4 justify-center"> 

          <button 

            onClick={() => { 

              setActivePage('issuedBooks'); 

              setCurrentPage(1); 

            }} 

            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${ 

              activePage === 'issuedBooks' 

                ? 'bg-blue-600 text-white shadow-lg scale-105' 

                : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105' 

            }`} 

          > 

            <span className="text-xl">📚</span> 

            Issued Books 

          </button> 

          <button 

            onClick={() => { 

              setActivePage('returnedBooks'); 

              setCurrentPage(1); 

            }} 

            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${ 

              activePage === 'returnedBooks' 

                ? 'bg-blue-600 text-white shadow-lg scale-105' 

                : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105' 

            }`} 

          > 

            <span className="text-xl">📅</span> 

            Returned Books 

          </button> 

          <button 

            onClick={() => { 

              setActivePage('dueDate'); 

              setCurrentPage(1); 

            }} 

            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${ 

              activePage === 'dueDate' 

                ? 'bg-blue-600 text-white shadow-lg scale-105' 

                : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white hover:scale-105' 

            }`} 

          > 

            <span className="text-xl">⚠️</span> 

            Due Date 

          </button> 

        </div> 

 

        <div className="mt-6 w-full min-h-[calc(100vh-300px)] flex flex-col bg-gray-50 rounded-lg p-4"> 

          {getCurrentBooks().map((book) => ( 

            <div key={book.id} className="p-4 mb-4 border rounded-lg shadow-sm bg-white flex justify-between"> 

              <p><strong>Title:</strong> {book.title}</p> 

              <p><strong>Issued Date:</strong> {book.issuedDate} | <strong>Due Date:</strong> {book.dueDate}</p> 

            </div> 

          ))} 

 

          <div className="flex justify-center mt-6 gap-2"> 

            {getPagination().map((page, index) => ( 

              <button 

                key={index} 

                onClick={() => typeof page === 'number' && handlePageChange(page)} 

                className={`px-4 py-2 rounded-lg transition-all duration-300 ${ 

                  currentPage === page 

                    ? 'bg-blue-600 text-white' 

                    : 'bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white' 

                }`} 

              > 

                {page} 

              </button> 

            ))} 

          </div> 

        </div> 

      </div> 

    </div> 

  ); 

} 

 

export default Profile; 

 

 