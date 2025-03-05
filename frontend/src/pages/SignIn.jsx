import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/main");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Sign In</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">Login</button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-indigo-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
