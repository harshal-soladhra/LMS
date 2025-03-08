import { useState } from "react";
import { registerUser, loginUser } from "../api";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const data = await loginUser({ email, password });
            alert(data ? "Login successful!" : "Login failed.");
        } else {
            const data = await registerUser({ name, email, password, role: "member" });
            alert(data ? "Registration successful!" : "Registration failed.");
        }
    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 ">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800" >{isLogin ? "Login" : "Register"}</h2>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {!isLogin && (
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
                        )}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
                        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 cursor-pointer" type="submit">{isLogin ? "Login" : "Register"}</button>
                    </form>
                    <button className="mt-4 text-center text-gray-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Switch to Register" : "Switch to Login"}</button>
                </div>
            </div>
        </>
    );
};

export default AuthForm;
