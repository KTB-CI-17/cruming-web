import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Profile from "./pages/profile.tsx";
import Timeline from "./pages/timeline.tsx";
import FootAnalysis from "./pages/foot-analysis.tsx";
import Community from "./pages/community.tsx";
import Hold from "./pages/hold.tsx";

function App() {
    return (
        <Router>
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
        </Router>
    );
}

export default App;