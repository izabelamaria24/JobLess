import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, credentials);
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            console.error("Login failed:", error.response.data);
        }
    };

    const register = async (credentials) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/register`, credentials);
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            console.error("Registration failed:", error.response.data);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = async (updatedData) => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}`, updatedData);
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            console.error("Update failed:", error.response.data);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};