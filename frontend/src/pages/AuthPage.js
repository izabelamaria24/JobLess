import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../design/AuthPage.css"; 

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                await login(formData);
            } else {
                await register(formData);
            }
            navigate("/dashboard");
        } catch (err) {
            setError("Authentication failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? "Welcome Back!" : "Create an Account"}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-button">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;