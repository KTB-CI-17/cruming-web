import {useCallback, useState} from "react";
import {TimelineDetailResponse} from "../../types/timeline";
import {AxiosError} from "axios";
import {api} from "../../config/axios";
import {timelineService} from "../../services/timelineService";

export function useTimelineDetail(timelineId: string) {

    const [timeline, setTimeline] = useState<TimelineDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTimelineDetail = useCallback(async() => {
        try {
            setIsLoading(true);
            const data = await timelineService.getDetail(timelineId);
            setTimeline(data);
            return data;
        } catch (e) {
            const error = e as AxiosError;
            const message = error.response?.status === 404
                ? "게시글을 찾을 수 없습니다."
                : "게시글을 불러오는데 실패했습니다.";
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [timelineId]);

    const deleteTimeline = useCallback(async () => {
        if (!timeline) return;
        try {
            await api.delete(`/posts/${timeline.id}`);
            return true;
        } catch (error) {
            console.error(error);
            throw new Error("삭제에 실패했습니다.");
        }
    }, [timeline]);

    const toggleTimelineLike = useCallback(async () => {
        if (!timeline) return false;

        try {
            const { data } = await api.post<boolean>(`/posts/${timeline.id}/likes`);
            setTimeline(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isLiked: data,
                    likeCount: data ? prev.likeCount + 1 : prev.likeCount - 1
                };
            });
            return data;
        } catch (error) {
            console.error(error);
            throw new Error("좋아요 처리에 실패했습니다.");
        }
    }, [timeline]);


    return {
        timeline,
        isLoading,
        error,
        fetchTimelineDetail,
        deleteTimeline,
        toggleTimelineLike
    }
}