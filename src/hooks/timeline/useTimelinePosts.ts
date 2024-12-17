import { useState, useCallback } from 'react';
import { ServerVisibilityType, Timeline } from '../../types/timeline';
import { timelineService } from '../../services/timelineService';

export function useTimelinePosts() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMonthlyTimelines = useCallback(async (year: number, month: number) => {
        setIsLoading(true);
        try {
            const data = await timelineService.getMonthlyTimelines(year, month);
            const transformedData: Timeline[] = data.map(item => ({
                ...item,
                userProfile: '',
                isLiked: false,
                likeCount: 0,
                replyCount: 0,
                visibility: 'PUBLIC' as ServerVisibilityType,
                activityAt: item.createdAt
            }));
            setTimelines(transformedData);
        } catch (error) {
            console.error('Failed to fetch monthly timelines:', error);
            setTimelines([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const fetchDailyTimelines = useCallback(async (year: number, month: number, day: number) => {
        setIsLoading(true);
        try {
            const data = await timelineService.getDailyTimelines(year, month, day);
            const transformedData: Timeline[] = data.map(item => ({
                ...item,
                userProfile: '',
                isLiked: false,
                likeCount: 0,
                replyCount: 0,
                visibility: 'PUBLIC' as ServerVisibilityType,
                activityAt: item.createdAt
            }));
            setTimelines(transformedData);
        } catch (error) {
            console.error('Failed to fetch daily timelines:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        timelines,
        isLoading,
        isRefreshing,
        fetchMonthlyTimelines,
        fetchDailyTimelines,
        setTimelines
    };
}