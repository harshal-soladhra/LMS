import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 flex flex-col">
      {/* Profile & Notifications */}
      <div className="p-5 text-xl font-bold flex justify-between items-center border-b border-gray-600">
        <Link to="/profile">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full w-8 h-8 cursor-pointer"
          />
        </Link>
        <Link to="/notifications">
          <span className="text-lg cursor-pointer">🔔</span>
        </Link>
      </div>

      {/* Sidebar Links */}
      <div className="p-5 space-y-4">
        <Link to="/" className="block p-2 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/books" className="block p-2 hover:bg-gray-700 rounded">Books</Link>
        <Link to="/transactions" className="block p-2 hover:bg-gray-700 rounded">Transactions</Link>
        <Link to="/logout" className="block p-2 hover:bg-gray-700 rounded">Logout</Link>
      </div>
    </div>
  );
}

export default Sidebar;
