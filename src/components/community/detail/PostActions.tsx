import { Post } from '../../../types/community';

interface PostActionsProps {
    post: Post;
    replyCount: number;
    onLike: () => Promise<boolean>;
    onShare: () => void;
    onReply: () => void;
}

export default function PostActions({ post, onLike, onShare, onReply }: PostActionsProps) {
    return (
        <div className="flex gap-4 p-4 border-t border-gray-200">
            <button onClick={onReply} className="flex items-center gap-1">
                <span className="text-gray-600">💬</span>
                {post.replyCount > 0 && (
                    <span className="text-sm text-gray-600">{post.replyCount}</span>
                )}
            </button>

            <button onClick={onLike} className="flex items-center gap-1">
                <span className={post.isLiked ? "text-red-500" : "text-gray-600"}>
                    {post.isLiked ? "❤️" : "🤍"}
                </span>
                {post.likeCount > 0 && (
                    <span className="text-sm text-gray-600">{post.likeCount}</span>
                )}
            </button>

            <button onClick={onShare} className="text-gray-600">
                📤
            </button>
        </div>
    );
}