import { useState, useCallback } from 'react';
import { timelineService } from '../../services/timelineService';
import { TimelineListResponse } from '../../types/timeline';

export function useCommunityTimeline(userId?: string) {
    const [timelines, setTimelines] = useState<TimelineListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchTimelines = useCallback(async (page = 0) => {
        if (page === 0) {
            setIsLoading(true);
            setTimelines([]);
        }

        try {
            const response = await timelineService.getFollowingTimeline(page);

            setTimelines(prev => (page === 0 ? response.content : [...prev, ...response.content]));
            setCurrentPage(page);
            setHasMore(!response.last);
        } catch (error) {
            console.error('Failed to fetch timelines:', error);
            if (page === 0) setTimelines([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [userId]);

    const fetchNextPage = useCallback(async () => {
        if (!hasMore || isLoading) return;

        const nextPage = currentPage + 1;
        await fetchTimelines(nextPage);
    }, [currentPage, hasMore, isLoading, fetchTimelines]);

    return {
        timelines,
        isLoading,
        isRefreshing,
        hasMore,
        fetchTimelines,
        fetchNextPage,
    };
}