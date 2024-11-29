import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile";
import Timeline from "./pages/timeline";
import FootAnalysis from "./pages/foot-analysis";
import Community from "./pages/community";
import Hold from "./pages/hold";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import Login from "./pages/login.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/profile" replace />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/hold" element={<Hold />} />
                                        <Route path="/timeline" element={<Timeline />} />
                                        <Route path="/community" element={<Community />} />
                                        <Route path="/foot-analysis" element={<FootAnalysis />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Navigate to="/profile" replace />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/hold" element={<Hold />} />
                        <Route path="/timeline" element={<Timeline />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/foot-analysis" element={<FootAnalysis />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;