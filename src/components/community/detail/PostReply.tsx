import { Reply } from '../../../types/community';


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

    const renderReplyItem = (item: Reply, isChild = false) => (
        <div key={item.id} className={`p-4 ${isChild ? 'ml-8 bg-gray-50' : 'border-b border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-2">
                <img
                    src="/default-profile.png"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                    onClick={() => onProfilePress(item.userId)}
                />
                <span className="font-semibold">{item.userNickname}</span>
            </div>
            <p className="mb-2 ml-10">{item.content}</p>
            <div className="flex gap-4 text-sm text-gray-500 ml-10">
                <span>{formatDate(item.createdAt)}</span>
                {!isChild && <button onClick={() => onReply(item.id)}>답글</button>}
                {item.isWriter && (
                    <>
                        <button onClick={() => onEditReply(item.id)}>수정</button>
                        <button onClick={() => onDeleteReply(item.id)}>삭제</button>
                    </>
                )}
            </div>
            {item.children && item.children.length > 0 && (
                <div className="mt-2">
                    {item.children.map(child => renderReplyItem(child, true))}
                    {item.childCount && item.childCount > item.children.length && !loadingStates[item.id] && (
                        <button
                            onClick={() => onLoadChildren(item.id, Math.ceil(item.children!.length / 5))}
                            className="ml-8 mt-2 text-sm text-gray-500"
                        >
                            대댓글 {item.childCount - item.children.length}개 더보기
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="divide-y divide-gray-100">
            {replies.map(reply => renderReplyItem(reply))}
            {loading && (
                <div className="py-4 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                </div>
            )}
            {!loading && hasMore && (
                <button
                    onClick={onLoadMore}
                    className="w-full py-3 text-gray-500 hover:bg-gray-50"
                >
                    댓글 더보기
                </button>
            )}
        </div>
    );
}