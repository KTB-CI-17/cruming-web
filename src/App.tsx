import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile";
import Timeline from "./pages/timeline";
import FootAnalysis from "./pages/foot-analysis";
import Community from "./pages/community";
import CommunityDetail from "./pages/communityDetail";
import Hold from "./pages/hold";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Login from "./pages/login.tsx";
import KakaoCallback from "./pages/KakaoCallback.tsx";
import NewPost from "./pages/new.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Navigate to="/timeline" replace />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/hold" element={<Hold />} />
                            <Route path="/timeline" element={<Timeline />} />

                            <Route path="/community" element={<Community />} />
                            <Route path="/community/:id" element={<CommunityDetail />} />
                            <Route path="/community/new" element={<NewPost />} />


                            <Route path="/foot-analysis" element={<FootAnalysis />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;