import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const url = isLogin ? "/api/login" : "/api/register";
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.message || "Something went wrong");
            return;
        }

        login(data.token);
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="p-2 border rounded"
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="p-2 border rounded"
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="mt-2 text-blue-500">
                {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </button>
        </div>
    );
};

export default AuthPage;
