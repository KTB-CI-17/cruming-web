import React, { useState } from 'react';

interface TabProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-base transition-colors ${
            isActive
                ? 'text-[#826CF6] font-medium border-b-[3px] border-[#826CF6]'
                : 'text-[#8F9BB3] border-b-[3px] border-transparent'
        }`}
    >
        {label}
    </button>
);

export interface TabNavigationProps {
    onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState('General');

    const tabs = [
        { id: 'General', label: '자유게시판' },
        { id: 'Problem', label: '만든 문제' },
        { id: 'Timeline', label: '타임라인' }
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="w-full border-b border-gray-200 bg-white px-3 my-2">
            <nav className="flex justify-between px-2">
                {tabs.map(tab => (
                    <Tab
                        key={tab.id}
                        label={tab.label}
                        isActive={activeTab === tab.id}
                        onClick={() => handleTabClick(tab.id)}
                    />
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;