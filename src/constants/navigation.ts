import {TabItem} from "../types/layout";

export const NAVIGATION_TABS: TabItem[] = [
    {
        path: '/profile',
        title: '내 정보',
        icon: '/src/assets/icon/mypage.png'
    },
    {
        path: '/hold',
        title: '문제 출제',
        icon: '/src/assets/icon/hold.png'
    },
    {
        path: '/timelines',
        title: '타임라인',
        icon: '/src/assets/icon/timeline.png'
    },
    {
        path: '/community',
        title: '커뮤니티',
        icon: '/src/assets/icon/community.png'
    },
    {
        path: '/foot-analysis',
        title: '암벽화',
        icon: '/src/assets/icon/shoes.png'
    }
] as const;