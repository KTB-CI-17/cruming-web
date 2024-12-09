import { useState, useCallback } from 'react';
import { Timeline, APIResponse } from '../../types/timeline';

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 더미 API 응답 생성 함수
    const getDummyAPIResponse = useCallback((page: number): APIResponse => {
        const dummyData = [
            {
                title: "손상원 클라이밍 판교점",
                subtitle: "오버행이 많아서 팔이 터질 것 같았다",
                color: '#735BF2',
                locations: ["판교", "강남", "역삼", "분당", "영등포"]
            },
            {
                title: "더클라이밍 강남점",
                subtitle: "슬랩이 많아서 발이 아프다",
                color: '#E31A1A',
                locations: ["강남", "신사", "압구정", "청담", "삼성"]
            },
            {
                title: "클라이밍파크",
                subtitle: "볼더링 루트가 재미있었다",
                color: '#00A3FF',
                locations: ["홍대", "합정", "상수", "망원", "연남"]
            }
        ];

        const startIndex = (page - 1) * 10;
        const timelinesForPage = Array(10).fill(null).map((_, index) => {
            const postIndex = (startIndex + index) % dummyData.length;
            const dummyItem = dummyData[postIndex];

            const today = new Date();
            const randomDays = Math.floor(Math.random() * 30);
            const postDate = new Date(today);
            postDate.setDate(postDate.getDate() - randomDays);

            const formattedDate = postDate.toISOString().split('T')[0];
            const locationIndex = Math.floor(Math.random() * dummyItem.locations.length);
            const location = dummyItem.locations[locationIndex];

            return {
                id: startIndex + index + 1,
                title: `${dummyItem.title} ${location}점`,
                subtitle: `${dummyItem.subtitle} (난이도: ${Math.floor(Math.random() * 3) + 3}단)`,
                date: formattedDate,
                imageUrl: '/images/climbing.png',
                color: dummyItem.color
            };
        });

        return {
            timelines: timelinesForPage,
            meta: {
                currentPage: page,
                totalPages: 5,
                hasMore: page < 5
            }
        };
    }, []);

    const fetchTimelines = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
        if (isLoading || (!hasMore && !isRefresh)) return;

        try {
            setIsLoading(true);
            const response = getDummyAPIResponse(page);

            if (isRefresh) {
                setTimelines(response.timelines);
            } else {
                setTimelines(prev => [...prev, ...response.timelines]);
            }

            setCurrentPage(page);
            setHasMore(response.meta.hasMore);
        } catch (error) {
            console.error('Failed to fetch timelines:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [isLoading, hasMore, getDummyAPIResponse]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setHasMore(true);
        setCurrentPage(1);
        fetchTimelines(1, true);
    }, [fetchTimelines]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchTimelines(currentPage + 1);
        }
    }, [isLoading, hasMore, currentPage, fetchTimelines]);

    return {
        timelines,
        isLoading,
        isRefreshing,
        hasMore,
        handleRefresh,
        handleLoadMore,
        setTimelines
    };
}