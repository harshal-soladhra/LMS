import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/main");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="password" placeholder="Confirm Password" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Register</button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-500">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
