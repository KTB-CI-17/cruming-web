import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile";
import Timeline from "./pages/timeline";
import FootAnalysis from "./pages/foot-analysis";
import Community from "./pages/community";
import Hold from "./pages/hold";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Login from "./pages/login.tsx";
import KakaoCallback from "./pages/kakao-login-call-back.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Navigate to="/profile" replace />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/hold" element={<Hold />} />
                            <Route path="/timeline" element={<Timeline />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/foot-analysis" element={<FootAnalysis />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;