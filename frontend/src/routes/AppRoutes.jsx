import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Books from "../pages/Books";
import ProtectedRoute from "../components/ProtectedRoute";
import AvailableBooks from "../pages/AvailableBooks";
import AddBook from "../pages/AddBook";
import Ebooks from "../pages/Ebooks";
import AudioBooks from "../pages/AudioBooks";
import AdminProfile from "../pages/AdminProfile";
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}></Route>
            <Route path="/" element={<Main />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/main" element={<Main />} />
            <Route path="/Books" element={<Books />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/available-books" element={<AvailableBooks/>} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/audiobooks" element={<AudioBooks />} />
            <Route path="/adminprofile" element={<AdminProfile />} />
            {/* 404 Page */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes;
