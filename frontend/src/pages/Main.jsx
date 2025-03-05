import { Link } from "react-router-dom";

const Main = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to the LMS</h1>
            <p className="mt-4 text-gray-600">Navigate through the website from here.</p>
            <div className="mt-6 flex space-x-4">
                <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Sign Out</Link>
            </div>
        </div>
    );
};

export default Main;
