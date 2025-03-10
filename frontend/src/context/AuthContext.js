import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const loggedUser = localStorage.getItem("user");
        if (loggedUser) setUser(JSON.parse(loggedUser));
    }, []);

    const login = async (credentials) => {
        const res = await axios.post("/api/login", credentials);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
