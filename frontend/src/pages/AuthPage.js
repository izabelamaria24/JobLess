import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../design/AuthPage.css";
import Alert from "../components/Alert";
import { useAlert } from "../utils/useAlert"; 

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login, register } = useContext(AuthContext);
    const { alert, showAlert, closeAlert } = useAlert(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData);
                showAlert("success", "Login successful!");
            } else {
                await register(formData);
                showAlert("success", "Registration successful!");
            }
            navigate("/dashboard");
        } catch (err) {
            showAlert("error", "Authentication failed. Check your credentials.");
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
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="First Name"
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Last Name"
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </>
                    )}
                    <button type="submit" className="auth-button">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                </button>
            </div>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
            )}
        </div>
    );
};

export default AuthPage;