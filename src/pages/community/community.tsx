import React, { useState } from 'react';
import TabNavigation from '../../components/community/list/TabNavigation.tsx';
import SearchBar from '../../components/community/list/SearchBar.tsx';
import GeneralTab from '../../components/community/list/GeneralTab.tsx';
import ProblemTab from '../../components/community/list/ProblemTab.tsx';
import TimelineTab from '../../components/community/list/TimelineTab.tsx';

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
        </div>
    );
};

export default CommunityPage;