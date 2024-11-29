import { Outlet } from 'react-router-dom';
import TabBar from '../components/layout/TabBar';

export default function TabLayout() {
    return (
        <div className="flex flex-col h-screen">
            <main className="flex-1 overflow-auto bg-white">
                <Outlet />
            </main>
            <TabBar />
        </div>
    );
}