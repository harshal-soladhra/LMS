import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("member"); // Default role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                name, email, password, role
            });

            localStorage.setItem("token", response.data.token);
            navigate("/main"); // Redirect after successful signup
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <input 
                        type="text" placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded-lg"
                        value={name} onChange={(e) => setName(e.target.value)} required
                    />
                    <input 
                        type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <input 
                        type="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-lg"
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                    />
                    <input 
                        type="password" placeholder="Confirm Password" className="w-full p-3 border border-gray-300 rounded-lg"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    />
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        value={role} onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="member">Member</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button 
                        type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-500">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
