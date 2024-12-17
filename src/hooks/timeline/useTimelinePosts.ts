import { useState, useCallback } from 'react';
import { timelineService } from '../../services/timelineService';
import { TimelineListResponse, TimelinePageResponse } from '../../types/timeline';

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<TimelineListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [currentYear, setCurrentYear] = useState<number>();
    const [currentMonth, setCurrentMonth] = useState<number>();

    const deleteTimeline = async (id: number) => {
        try {
            await timelineService.deleteTimeline(id);
            setTimelines((prevTimelines) =>
                prevTimelines.filter((timeline) => timeline.id !== id)
            );
            return true;
        } catch (error) {
            console.error('Failed to delete timeline:', error);
            return false;
        }
    };

    const fetchMonthlyTimelines = useCallback(async (year: number, month: number, page = 0) => {
        if (page === 0) {
            setIsLoading(true);
            setTimelines([]);
        }

        try {
            const response: TimelinePageResponse = await timelineService.getMonthlyTimelines(year, month, page);

            if (page === 0) {
                setTimelines(response.content);
            } else {
                setTimelines(prev => [...prev, ...response.content]);
            }

            setCurrentYear(year);
            setCurrentMonth(month);
            setCurrentPage(page);
            setHasMore(!response.last);
        } catch (error) {
            console.error('Failed to fetch monthly timelines:', error);
            if (page === 0) setTimelines([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const fetchNextPage = useCallback(async () => {
        if (!hasMore || !currentYear || !currentMonth || isLoading) return;

        const nextPage = currentPage + 1;
        await fetchMonthlyTimelines(currentYear, currentMonth, nextPage);
    }, [currentYear, currentMonth, currentPage, hasMore, isLoading, fetchMonthlyTimelines]);

    return {
        timelines,
        isLoading,
        isRefreshing,
        hasMore,
        fetchMonthlyTimelines,
        fetchNextPage,
        setTimelines,
        deleteTimeline
    };
}