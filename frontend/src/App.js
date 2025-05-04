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

function App() {
    return (
        <AuthProvider>
            <JobApplicationsProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<AuthPage />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/applications"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Applications />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/applications/:id" 
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Application />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                            <ProtectedRoute>
                                <Layout>
                                <Root />
                                </Layout>
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/resumes"
                            element={
                            <ProtectedRoute>
                                <Layout>
                                <Resumes />
                                </Layout>
                            </ProtectedRoute>
                            }
                        />

                        <Route 
                            path="/viewer" 
                            element={
                            <ProtectedRoute>
                                <Layout>
                                    <PdfViewer />
                                </Layout>
                            </ProtectedRoute>
                                } 
                        />
                        <Route 
                            path="/resume-tips" 
                            element={
                            <ProtectedRoute>
                                <Layout>
                                    <ResumeTips />
                                </Layout>
                            </ProtectedRoute>
                                } 
                        />
                    </Routes>
                </Router>
            </JobApplicationsProvider>
        </AuthProvider>
    );
}

export default App;