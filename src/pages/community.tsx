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
        <div className="flex flex-col h-full bg-white page-container">
            <div className="bg-white">
                <TabNavigation onTabChange={setCurrentTab}/>
                <SearchBar/>
            </div>
            <div className="max-w-screen-sm mx-auto w-full">
                {renderTabContent()}
            </div>
            <AddButton/>
        </div>
    );

};

export default CommunityPage;