import React, { useState } from 'react';
import TabNavigation from '../components/community/TabNavigation';
import SearchBar from '../components/community/SearchBar';
import GeneralTab from '../components/community/GeneralTab';
import ProblemTab from '../components/community/ProblemTab';
import TimelineTab from '../components/community/TimelineTab.tsx';
import AddButton from '../components/community/AddButton';

const CommunityPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('General');

    const renderTabContent = () => {
        switch (currentTab) {
            case 'General':
                return <GeneralTab />;
            case 'Problem':
                return <ProblemTab />;
            case 'Timeline':
                return <TimelineTab />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="fixed top-0 left-0 right-0 z-10 bg-white">
                <SearchBar />
                <TabNavigation onTabChange={setCurrentTab} />
            </div>
            <div className="mt-[116px] pb-20 max-w-screen-sm mx-auto w-full">
                {renderTabContent()}
            </div>
            <AddButton />
        </div>
    );
};

export default CommunityPage;