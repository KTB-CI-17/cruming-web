import { TabItem } from '../types/layout';

export const NAVIGATION_TABS: TabItem[] = [
    {
        path: '/profile',
        title: '내 정보',
        icon: '/src/assets/tab-bar-icon/mypage.png'
    },
    {
        path: '/hold',
        title: '문제 출제',
        icon: '/src/assets/tab-bar-icon/hold.png'
    },
    {
        path: '/timeline',
        title: '타임라인',
        icon: '/src/assets/tab-bar-icon/timeline.png'
    },
    {
        path: '/community',
        title: '커뮤니티',
        icon: '/src/assets/tab-bar-icon/community.png'
    },
    {
        path: '/foot-analysis',
        title: '암벽화',
        icon: '/src/assets/tab-bar-icon/shoes.png'
    }
] as const;