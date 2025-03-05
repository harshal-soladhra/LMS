import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Logout from "./pages/Logout";




function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar (Always Fixed) */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
