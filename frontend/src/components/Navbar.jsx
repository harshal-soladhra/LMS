import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../supabaseClient"; // ✅ Import Supabase client

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fixed Logout Function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // ✅ Properly log out from Supabase
      localStorage.removeItem("token"); // ✅ Clear local storage
      navigate("/", { replace: true }); // ✅ Redirect to home page
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full shadow-lg transition-all bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold">
          📚 LMS
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg">
          {[
            { path: "/", label: "Home" },
            { path: "/books", label: "Books" },
            { path: "/my-books", label: "Notification" },
            { path: "/add-book", label: "Admin Panel" },
            { path: "/profile", label: "Profile" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="relative text-white after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="cursor-pointer relative text-white after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Current Time and Calendar Button */}
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">{currentTime}</div>
          <div
            className="relative cursor-pointer p-2 bg-white text-black rounded-full hover:bg-gray-300"
            onMouseEnter={() => setShowCalendar(true)}
            onMouseLeave={() => setShowCalendar(false)}
          >
            📅
            {showCalendar && (
              <div className="absolute right-0 mt-2 bg-white p-4 shadow-lg rounded-lg z-50">
                <Calendar />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-blue-700">
          <ul className="text-center space-y-4 py-4">
            {[
              { path: "/", label: "Home" },
              { path: "/books", label: "Books" },
              { path: "/my-books", label: "Notification" },
              { path: "/admin", label: "Admin Panel" },
              { path: "/profile", label: "Profile" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block py-2 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                className="block py-2 text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
