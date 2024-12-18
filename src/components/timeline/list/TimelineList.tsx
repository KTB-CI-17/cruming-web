import { useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import TimelineCard from './TimelineCard';
import { useNavigate } from "react-router-dom";
import { TimelineListResponse } from "../../../types/timeline";

interface TimelineListProps {
    timelines: TimelineListResponse[];
    isLoading: boolean;
    isRefreshing: boolean;
    onOptionsPress?: (timelineId: number) => void | null;
    hasMore: boolean;
    onLoadMore: () => void;
}

export default function TimelineList({
                                         timelines,
                                         isLoading,
                                         isRefreshing,
                                         onOptionsPress,
                                         hasMore,
                                         onLoadMore
                                     }: TimelineListProps) {
    const navigate = useNavigate();
    const observerRef = useRef<IntersectionObserver>();

    const lastItemCallback = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isLoading, hasMore, onLoadMore]);

    function onTimelineClick(id: number) {
        navigate('/timelines/' + id);
    }

    if (isRefreshing) {
        return (
            <div className="flex justify-center py-4 bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-[#735BF2]" />
            </div>
        );
    }

    if (timelines.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p>등록된 타임라인이 없습니다.</p>
                <p className="mt-2">새로운 타임라인을 등록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="px-4 bg-white">
            {timelines.map((timeline, index) => (
                <div
                    key={timeline.id}
                    ref={index === timelines.length - 1 ? lastItemCallback : null}
                >
                    <TimelineCard
                        timeline={timeline}
                        onClick={() => onTimelineClick(timeline.id)}
                        showOptions={!!onOptionsPress}
                        onOptionsPress={onOptionsPress ? () => onOptionsPress(timeline.id) : undefined}
                    />
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#735BF2]" />
                </div>
            )}
        </div>
    );
}
