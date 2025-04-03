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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser(); // ✅ Get user safely
      if (userError || !user || !user.user) {
        console.error("❌ Error fetching user:", userError);
        return;
      }

      const userId = user.user.id; // ✅ Ensure valid user ID
      if (!userId) {
        console.error("❌ User ID is undefined!");
        console.log("User data:", user.user.id);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId) // ✅ Use valid UUID
        .eq("is_read", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("🔥 Error fetching notifications:", error);
      } else {
        console.log("✅ Notifications fetched:", data);
        setNotifications(data);
        setUnreadCount(data.length);
      }
    };

    fetchNotifications();
    // ✅ Real-time notification updates
    const subscription = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);


const markAsRead = async (id) => {
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  setNotifications(notifications.filter((n) => n.id !== id));
  setUnreadCount((prev) => prev - 1);
};

// ✅ Fixed Logout Function
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

return (
  <nav className="fixed top-0 left-0 w-full shadow-lg transition-all bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold">📚 LMS</Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-lg">
        {[
          { path: "/", label: "Home" },
          { path: "/books", label: "Books" },
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

      {/* Notifications Bell & Calendar */}
      <div className="flex items-center space-x-4">
        <div className="text-lg font-semibold">{currentTime}</div>

        {/* Calendar */}
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

        {/* 🔔 Notifications Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg p-4 w-80 z-50">
              <h3 className="font-bold text-lg">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-gray-600">No new notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="border-b py-2 flex justify-between">
                    <p>{notification.message}</p>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 text-sm"
                    >
                      Mark as Read
                    </button>
                  </div>
                ))
              )}
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
            <button className="block py-2 text-white" onClick={handleLogout}>
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
