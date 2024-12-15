import { useState, useCallback } from 'react';
import { Timeline } from '../../types/timeline';
import { timelineService } from '../../services/timelineService';

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMonthlyTimelines = useCallback(async (year: number, month: number) => {
        setIsLoading(true);
        try {
            const data = await timelineService.getMonthlyTimelines(year, month);
            setTimelines(data);
        } catch (error) {
            console.error('Failed to fetch monthly timelines:', error);
            setTimelines([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    return {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        setTimelines
    };
}