import {Reply} from "../../../types/community.ts";

interface PostReplyProps {
    replies: Reply[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    onReply: (replyId: number) => void;
    onProfilePress: (userId: number) => void;
    onLoadChildren: (parentId: number, page: number) => Promise<boolean>;
    onDeleteReply: (replyId: number) => void;
    onEditReply: (replyId: number) => void;
    totalCount: number;
    loadingStates?: { [key: number]: boolean };
}

export default function PostReply({
                                      replies,
                                      onLoadMore,
                                      hasMore,
                                      loading,
                                      onReply,
                                      onProfilePress,
                                      onLoadChildren,
                                      onDeleteReply,
                                      onEditReply,
                                      totalCount,
                                      loadingStates = {},
                                  }: PostReplyProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 2) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        return date.toLocaleDateString();
    };

    const handleDeleteReply = (replyId: number) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            onDeleteReply(replyId);
        }
    };

    const renderReplyItem = (reply: Reply, isChild = false) => (
        <div key={reply.id} className={`px-4 py-4 ${isChild ? 'pl-12' : ''}`}>
            <div className="flex items-center justify-between mb-2">
                <button
                    className="flex items-center"
                    onClick={() => onProfilePress(reply.userId)}
                >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <img
                            src="/images/default-profile.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="ml-2 text-sm font-semibold">
                        {reply.userNickname}
                    </span>
                </button>
            </div>

            <p className="text-sm leading-relaxed ml-10 text-gray-900 whitespace-pre-wrap break-words overflow-hidden">
                {reply.content}
            </p>

            <div className="flex items-center justify-between mt-2 ml-10">
                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                <div className="flex items-center gap-4">
                    {!isChild && (
                        <button
                            onClick={() => onReply(reply.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            답글
                        </button>
                    )}
                    {reply.isWriter && (
                        <>
                            <button
                                onClick={() => onEditReply(reply.id)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDeleteReply(reply.id)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!isChild && reply.children && reply.children.length > 0 && (
                <div className="mt-4 space-y-4">
                    {reply.children.map(child => renderReplyItem(child, true))}
                    {reply.childCount && reply.childCount > (reply.children?.length || 0) && !loadingStates[reply.id] && (
                        <button
                            onClick={() => {
                                const nextPage = Math.ceil((reply.children?.length || 0) / 5);
                                onLoadChildren(reply.id, nextPage);
                            }}
                            className="ml-12 px-4 py-2 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg"
                        >
                            답글 {reply.childCount - (reply.children?.length || 0)}개 더보기
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const remainingReplies = totalCount - replies.length;

    return (
        <div className="border-t border-gray-100">
            <div>
                {replies.map(reply => renderReplyItem(reply))}
                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                )}
                {!loading && hasMore && remainingReplies > 0 && (
                    <button
                        onClick={onLoadMore}
                        className="w-full py-3 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        댓글 더보기
                    </button>
                )}
            </div>
        </div>
    );
}