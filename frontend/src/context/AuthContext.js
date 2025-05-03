import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginstate, setLoginstate] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedToken = localStorage.getItem("token");
        if (storedToken){
            setToken(JSON.parse(storedToken));
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        } 

        setLoading(false);
        
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/Account/login`, credentials);

            console.log(res);
            

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", JSON.stringify(res.data.token));
            
            setUser(res.data.user);
            // setLoginstate(true);
            

            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        } catch (error) {
            console.error("Login failed:", error.response.data);
        }
    };


    const register = async (credentials) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/Account/register`, credentials);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (error) {
            console.error("Registration failed:", error.response.data);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
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
        <AuthContext.Provider value={{ user, token, loginstate, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};