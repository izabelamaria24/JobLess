import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    // const { token, loading } = useContext(AuthContext);
    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (!token) {
    //     return <Navigate to="/login" />;
    // }

    return children;
};

export default ProtectedRoute;