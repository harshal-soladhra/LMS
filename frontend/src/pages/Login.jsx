import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("Logging in...", formData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-gray-500 text-center mb-4">Access your account</p>
        <div className="space-y-4">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            name="email"
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            name="password"
          />

          <Button text="Login" onClick={handleLogin} />
        </div>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
