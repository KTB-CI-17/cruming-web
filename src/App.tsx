import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile/profile";
import Timeline from "./pages/timeline/timeline";
import FootAnalysis from "./pages/foot-analysis/foot-analysis";
import Community from "./pages/community/community";
import CommunityEdit from "./pages/community/communityEdit";
import CommunityDetail from "./pages/community/communityDetail";
import Hold from "./pages/hold/hold";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/login/login";
import KakaoCallback from "./pages/login/KakaoCallback";
import NewGeneralPage from "./pages/community/general";
import NewProblemPage from "./pages/community/problem";
import {Settings} from "./pages/profile/Settings";
import {Follows} from "./pages/profile/follows";
import ProfileEdit from "./pages/profile/profileEdit";

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
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/profile/edit" element={<ProfileEdit />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/follows" element={<Follows />} />
                            <Route path="/follows/:userId" element={<Follows />} />

                            <Route path="/hold" element={<Hold />} />
                            <Route path="/timelines" element={<Timeline />} />

                            <Route path="/community" element={<Community />} />
                            <Route path="/community/:id" element={<CommunityDetail />} />
                            <Route path="/community/edit/:id" element={<CommunityEdit />} />
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