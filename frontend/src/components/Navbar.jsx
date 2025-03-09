import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    navigate("/signin", { replace: true }); // ✅ Redirect to Sign In
  };
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold">
          📚 LMS
        </Link>

        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Link
              to="/"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/books"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Books
            </Link>
          </li>
          <li>
            <Link
              to="/my-books"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Notification
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Admin Panel
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:origin-left hover:after:w-full"
            >
              Logout
            </button >
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="md:hidden bg-indigo-800 text-center space-y-4 py-4">
          <li>
            <Link
              to="/"
              className="block py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/books"
              className="block py-2"
              onClick={() => setIsOpen(false)}
            >
              Books
            </Link>
          </li>
          <li>
            <Link
              to="/my-books"
              className="block py-2"
              onClick={() => setIsOpen(false)}
            >
              My Borrowed Books
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="block py-2"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="block py-2 text-red-300"
              onClick={() => setIsOpen(false)}
            >
              Logout
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
