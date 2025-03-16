import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Applications from "./Applications";
import Profile from "./Profile";
import Statistics from "./Statistics";

const Dashboard = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/statistics" element={<Statistics />} />
            </Routes>
        </>
    );
};
export default Dashboard;