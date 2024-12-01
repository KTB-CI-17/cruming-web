import {Reply} from "../../../types/community.ts";
import {useCallback, useEffect, useRef} from "react";
import {formatTimeAgo} from "../../../utils/formatTime.ts";
import {REPLY_PAGINATION} from "../../../../constants/replyPagination.ts";

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
                                      totalCount = 0,
                                      childrenMap = {}
                                  }: PostReplyProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

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

    const handleChildReplyPress = useCallback((parentId: number) => {
        onReply(parentId);
    }, [onReply]);

    if (loading && replies.length === 0) {
        return (
            <div className="px-4">
                <div className="py-4 border-b border-gray-200">
                    <span className="text-lg font-medium">댓글</span>
                </div>
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="py-4 border-b border-gray-200 animate-pulse">
                        <div className="flex space-x-2">
                            <div className="w-20 h-4 bg-gray-200 rounded" />
                            <div className="w-16 h-4 bg-gray-200 rounded" />
                        </div>
                        <div className="mt-2 w-3/4 h-4 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="px-4">
            {replies.map(reply => (
                <div key={reply.id} className="py-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onProfilePress(reply.userId)}
                            className="font-medium"
                        >
                            {reply.userNickname}
                        </button>
                        <span className="text-gray-400">
                            {formatTimeAgo(reply.createdAt)}
                        </span>
                        {reply.isWriter && (
                            <span className="text-blue-500 text-sm">작성자</span>
                        )}
                    </div>

                    <p className="mt-1 break-words whitespace-pre-wrap">
                        {reply.content}
                    </p>

                    <div className="flex items-center space-x-4 mt-2">
                        <button
                            onClick={() => handleReplyPress(reply)}
                            className="text-gray-500 text-sm"
                        >
                            답글 달기
                        </button>
                        {reply.isWriter && (
                            <>
                                <button
                                    onClick={() => onEditReply(reply.id)}
                                    className="text-gray-500 text-sm"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => onDeleteReply(reply.id)}
                                    className="text-red-500 text-sm"
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>

                    <div className="ml-8 mt-2">
                        {childrenMap[reply.id] && childrenMap[reply.id].map(childReply => (
                            <div key={childReply.id} className="py-4">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onProfilePress(childReply.userId)}
                                        className="font-medium"
                                    >
                                        {childReply.userNickname}
                                    </button>
                                    <span className="text-gray-400">
                                        {formatTimeAgo(childReply.createdAt)}
                                    </span>
                                    {childReply.isWriter && (
                                        <span className="text-blue-500 text-sm">작성자</span>
                                    )}
                                </div>

                                <p className="mt-1 break-words whitespace-pre-wrap">
                                    {childReply.content}
                                </p>

                                <div className="flex items-center space-x-4 mt-2">
                                    <button
                                        onClick={() => handleChildReplyPress(reply.id)}
                                        className="text-gray-500 text-sm"
                                    >
                                        답글 달기
                                    </button>
                                    {childReply.isWriter && (
                                        <>
                                            <button
                                                onClick={() => onEditReply(childReply.id)}
                                                className="text-gray-500 text-sm"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => onDeleteReply(childReply.id)}
                                                className="text-red-500 text-sm"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                        {reply.childCount > 0 && (!childrenMap[reply.id] || reply.childCount > childrenMap[reply.id].length) && (
                            <button
                                onClick={() => {
                                    const nextPage = (childrenMap[reply.id]?.length || 0) / REPLY_PAGINATION.CHILD_REPLIES_PER_PAGE;
                                    onLoadChildren(reply.id, nextPage);
                                }}
                                className="mt-2 text-gray-500 text-sm"
                            >
                                답글 {reply.childCount - (childrenMap[reply.id]?.length || 0)}개 보기
                            </button>
                        )}
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
        </div>
    );
}