import TimelineList from "../../timeline/TimelineList";
import { useCommunityTimeline } from "../../../hooks/timeline/useCommunityTimeline";
import { useEffect, useState, useRef } from "react";

const TimelineTab = () => {
    const {
        timelines,
        isLoading: timelineLoading,
        isRefreshing,
        hasMore,
        fetchTimelines
    } = useCommunityTimeline();

    const [page, setPage] = useState(0);

    const timelineListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchTimelines(page);
    }, [fetchTimelines, page]);

    const handleLoadMore = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        if (timelineListRef.current) {
            const currentScrollPosition = timelineListRef.current.scrollTop;
            timelineListRef.current.scrollTop = currentScrollPosition;
        }
    }, [timelines]);

    return (
        <div className="max-w-screen-sm mx-auto w-full pt-6">
            <div className="flex flex-col gap-6">
                <div
                    ref={timelineListRef}
                    style={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                    <TimelineList
                        timelines={timelines || []}
                        isLoading={timelineLoading}
                        isRefreshing={isRefreshing}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelineTab;