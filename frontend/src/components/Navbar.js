import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/statistics">Statistics</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
        </nav>
    );
};
export default Navbar;
