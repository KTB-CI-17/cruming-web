import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile/profile.tsx";
import Timeline from "./pages/timeline/timeline.tsx";
import FootAnalysis from "./pages/foot-analysis/foot-analysis.tsx";
import Community from "./pages/community/community.tsx";
import CommunityDetail from "./pages/community/communityDetail.tsx";
import Hold from "./pages/hold/hold.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Login from "./pages/login/login.tsx";
import KakaoCallback from "./pages/login/KakaoCallback.tsx";
import NewGeneralPage from "./pages/community/general.tsx";
import NewProblemPage from "./pages/community/problem.tsx";

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
                            <Route path="/community/general" element={<NewGeneralPage />} />
                            <Route path="/community/problem" element={<NewProblemPage />} />


                            <Route path="/foot-analysis" element={<FootAnalysis />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;