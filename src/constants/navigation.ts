import { TabItem } from "../types/layout";
import mypageIcon from '@/assets/icon/mypage.png';
import holdIcon from '@/assets/icon/hold.png';
import timelineIcon from '@/assets/icon/timeline.png';
import communityIcon from '@/assets/icon/community.png';
import shoesIcon from '@/assets/icon/shoes.png';

export const NAVIGATION_TABS: TabItem[] = [
    {
        path: '/profile',
        title: '내 정보',
        icon: mypageIcon
    },
    {
        path: '/hold',
        title: '문제 출제',
        icon: holdIcon
    },
    {
        path: '/timelines',
        title: '타임라인',
        icon: timelineIcon
    },
    {
        path: '/community',
        title: '커뮤니티',
        icon: communityIcon
    },
    {
        path: '/foot-analysis',
        title: '암벽화',
        icon: shoesIcon
    }
] as const;