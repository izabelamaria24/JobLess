import { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useAlert } from "../utils/useAlert"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginstate, setLoginstate] = useState(false);
    const [loading, setLoading] = useState(true);

    const { showAlert } = useAlert(); 

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Invalid user JSON in localStorage:", storedUser);
                localStorage.removeItem("user");
            }
        }

        const storedToken = localStorage.getItem("token");
        if (storedToken && storedToken !== "undefined") {
            try {
                const parsedToken = JSON.parse(storedToken);
                setToken(parsedToken);
                axios.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;
            } catch (e) {
                console.error("Invalid token JSON in localStorage:", storedToken);
                localStorage.removeItem("token");
            }
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axiosInstance.post("/api/Account/login", credentials);

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", JSON.stringify(res.data.token));
            
            setUser(res.data.user);
            setToken(res.data.token);

            showAlert("success", "Login successful!");
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            showAlert("error", "Login failed. Please check your credentials.");
        }
    };

    const register = async (credentials) => {
        try {
            const res = await axiosInstance.post("/api/Account/register", credentials);

            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));

            showAlert("success", "Registration successful!");
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            showAlert("error", "Registration failed. Please try again.");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        showAlert("success", "Logged out successfully.");
    };

    const updateUser = async (updatedData) => {
        try {
            updatedData.id = user.id;
            const res = await axiosInstance.put(`/api/Users/edit/${user.id}`, updatedData);
            const updatedUser = res.data.user;

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            showAlert("success", "User information updated successfully.");
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
            showAlert("error", "Failed to update user information. Please try again.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loginstate, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};