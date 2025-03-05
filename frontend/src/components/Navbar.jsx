import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Brand Logo */}
                <Link to="/" className="text-2xl font-bold">📚 LMS</Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 text-lg">
                    <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                    <li><Link to="/books" className="hover:text-gray-300">Books</Link></li>
                    <li><Link to="/my-books" className="hover:text-gray-300">Notification</Link></li>
                    <li><Link to="/admin" className="hover:text-gray-300">Admin Panel</Link></li>
                    <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
                    <li><Link to="/" className="hover:text-red-300">Logout</Link></li>
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
                    <li><Link to="/" className="block py-2" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/books" className="block py-2" onClick={() => setIsOpen(false)}>Books</Link></li>
                    <li><Link to="/my-books" className="block py-2" onClick={() => setIsOpen(false)}>My Borrowed Books</Link></li>
                    <li><Link to="/admin" className="block py-2" onClick={() => setIsOpen(false)}>Admin Panel</Link></li>
                    <li><Link to="/profile" className="block py-2" onClick={() => setIsOpen(false)}>Profile</Link></li>
                    <li><Link to="/" className="block py-2 text-red-300" onClick={() => setIsOpen(false)}>Logout</Link></li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
