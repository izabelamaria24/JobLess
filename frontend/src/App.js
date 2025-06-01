import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobApplicationsProvider } from "./context/ApplicationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Layout from "./components/Layout";
import Application from "./pages/Application";
import Home from "./pages/Home";
import Resumes from "./pages/Resumes";
import PdfViewer from "./components/PdfViewer";
import ResumeTips from "./pages/ResumeTips";
import CompareSalary from "./pages/CompareSalary";
import InterviewQuestions from "./pages/InterviewQuestions";
import CoverLetters from "./pages/CoverLetters";
import CoverLetterTips from "./pages/CoverLetterTips";

const ProtectedLayoutRoute = ({ element }) => (
    <ProtectedRoute>
        <Layout>{element}</Layout>
    </ProtectedRoute>
);

function App() {
    return (
        <AuthProvider>
            <JobApplicationsProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Auth />} />
                        <Route path="/*" element={<ProtectedLayoutRoute element={<Dashboard />} />} />
                        <Route path="/applications" element={<ProtectedLayoutRoute element={<Applications />} />} />
                        <Route path="/applications/:id" element={<ProtectedLayoutRoute element={<Application />} />} />
                        <Route path="/compare-salary" element={<ProtectedLayoutRoute element={<CompareSalary />} />} />
                        <Route path="/interview-questions" element={<ProtectedLayoutRoute element={<InterviewQuestions />} />} />
                        <Route path="/" element={<ProtectedLayoutRoute element={<Home />} />} />
                        <Route path="/resumes" element={<ProtectedLayoutRoute element={<Resumes />} />} />
                        <Route path="/cover-letters" element={<ProtectedLayoutRoute element={<CoverLetters />} />} />
                        <Route path="/viewer" element={<ProtectedLayoutRoute element={<PdfViewer />} />} />
                        <Route path="/resume-tips" element={<ProtectedLayoutRoute element={<ResumeTips />} />} />
                        <Route path="/cover-letter-tips" element={<ProtectedLayoutRoute element={<CoverLetterTips />} />} />
                    </Routes>
                </Router>
            </JobApplicationsProvider>
        </AuthProvider>
    );
}

export default App;