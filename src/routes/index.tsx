import { Routes, Route, Navigate } from 'react-router-dom';
import TabLayout from './TabLayout';

import Profile from '../pages/profile';
import Hold from '../pages/hold';
import Timeline from '../pages/timeline';
import Community from '../pages/community';
import FootAnalysis from '../pages/foot-analysis';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TabLayout />}>
                <Route index element={<Navigate to="/timeline" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="hold" element={<Hold />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="community" element={<Community />} />
                <Route path="foot-analysis" element={<FootAnalysis />} />
            </Route>
        </Routes>
    );
}