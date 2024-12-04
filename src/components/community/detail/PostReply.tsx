import {Reply} from "../../../types/community";
import {useCallback, useEffect, useRef, useState} from "react";
import {formatTimeAgo} from "../../../utils/formatTime";
import {REPLY_PAGINATION} from "../../../constants/replyPagination";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/outline";
import MoreActionsMenu from "../../common/MoreActionsMenu";

interface PostReplyProps {
    replies: Reply[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    onReply: (id: number | null) => void;
    onProfilePress: (userId: number) => void;
    onDeleteReply: (id: number) => void;
    onEditReply: (id: number | null) => void;
    totalCount: number;
    loadingStates: { [key: number]: boolean };
    childrenMap: { [key: number]: Reply[] };
    childrenHasMore: { [key: number]: boolean };
    onLoadChildren: (parentId: number, page: number) => Promise<boolean>;
}

export default function PostReply({
                                      replies = [],
                                      onLoadMore,
                                      hasMore,
                                      loading,
                                      onReply,
                                      onProfilePress,
                                      onLoadChildren,
                                      onDeleteReply,
                                      onEditReply,
                                      childrenMap = {},
                                  }: PostReplyProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !loading) {
                onLoadMore();
            }
        }, options);

        if (loadingRef.current) {
            observerRef.current.observe(loadingRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, onLoadMore]);

    const handleReplyPress = useCallback((reply: Reply) => {
        onReply(reply.id);
    }, [onReply]);

    const handleMorePress = (reply: Reply) => {
        setSelectedReplyId(reply.id);
    };

    const renderReply = (reply: Reply, isChild: boolean = false) => (
        <div className="flex gap-2 py-4">
            <button
                onClick={() => onProfilePress(reply.userId)}
                className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0"
            >
                <img
                    src="/images/default-profile.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </button>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onProfilePress(reply.userId)}
                            className="font-medium"
                        >
                            {reply.userNickname}
                        </button>
                        {reply.isWriter && (
                            <span className="text-blue-500 text-sm leading-normal">작성자</span>
                        )}
                    </div>
                    {reply.isWriter && (
                        <button
                            onClick={() => handleMorePress(reply)}
                            className="p-1 text-gray-400"
                        >
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <p className="mt-2 text-base break-words whitespace-pre-wrap">
                    {reply.content}
                </p>

                <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-400 text-sm">
                        {formatTimeAgo(reply.createdAt)}
                    </span>
                    {!isChild && (
                        <button
                            onClick={() => handleReplyPress(reply)}
                            className="text-gray-500 text-sm"
                        >
                            답글 달기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading && replies.length === 0) {
        return (
            <div className="px-4">
                <div className="py-4">
                    <span className="text-lg font-medium">댓글</span>
                </div>
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="py-4 border-b border-gray-200 animate-pulse">
                        <div className="flex gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                                <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="px-4">
            {replies.map((reply, index) => (
                <div key={reply.id}>
                    <div className={index !== replies.length - 1 ? "border-b border-gray-200" : ""}>
                        {renderReply(reply)}

                        {/* Child Replies */}
                        <div className="ml-10">
                            {childrenMap[reply.id]?.map(childReply => (
                                <div key={childReply.id}>
                                    {renderReply(childReply, true)}
                                </div>
                            ))}

                            {reply.childCount > 0 && (!childrenMap[reply.id] || reply.childCount > childrenMap[reply.id].length) && (
                                <button
                                    onClick={() => {
                                        const nextPage = (childrenMap[reply.id]?.length || 0) / REPLY_PAGINATION.CHILD_REPLIES_PER_PAGE;
                                        onLoadChildren(reply.id, nextPage);
                                    }}
                                    className="py-2 text-gray-500 text-sm"
                                >
                                    답글 {reply.childCount - (childrenMap[reply.id]?.length || 0)}개 보기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {hasMore && (
                <div ref={loadingRef} className="py-4 flex justify-center">
                    {loading && (
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                </div>
            )}

            <MoreActionsMenu
                isOpen={selectedReplyId !== null}
                onClose={() => setSelectedReplyId(null)}
                onEdit={() => {
                    if (selectedReplyId) {
                        onEditReply(selectedReplyId);
                        setSelectedReplyId(null);
                    }
                }}
                onDelete={() => {
                    if (selectedReplyId) {
                        onDeleteReply(selectedReplyId);
                        setSelectedReplyId(null);
                    }
                }}
            />
        </div>
    );
}