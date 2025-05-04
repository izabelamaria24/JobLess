import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { JobApplicationsProvider } from "./context/JobApplicationsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Layout from "./components/Layout";
import Application from "./pages/Application";
import Root from "./pages/Root";
import Resumes from "./pages/Resumes";
import PdfViewer from "./components/PdfViewer";
import ResumeTips from "./pages/ResumeTips";
import CompareSalary from "./pages/CompareSalary";
import InterviewQuestions from "./pages/InterviewQuestions";

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
                        <Route path="/login" element={<AuthPage />} />
                        <Route path="/*" element={<ProtectedLayoutRoute element={<Dashboard />} />} />
                        <Route path="/applications" element={<ProtectedLayoutRoute element={<Applications />} />} />
                        <Route path="/applications/:id" element={<ProtectedLayoutRoute element={<Application />} />} />
                        <Route path="/compare-salary" element={<ProtectedLayoutRoute element={<CompareSalary />} />} />
                        <Route path="/interview-questions" element={<ProtectedLayoutRoute element={<InterviewQuestions />} />} />
                        <Route path="/" element={<ProtectedLayoutRoute element={<Root />} />} />
                        <Route path="/resumes" element={<ProtectedLayoutRoute element={<Resumes />} />} />
                        <Route path="/viewer" element={<ProtectedLayoutRoute element={<PdfViewer />} />} />
                        <Route path="/resume-tips" element={<ProtectedLayoutRoute element={<ResumeTips />} />} />
                    </Routes>
                </Router>
            </JobApplicationsProvider>
        </AuthProvider>
    );
}

export default App;