import { Post } from '../../../types/community';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { formatTimeAgo } from '../../../utils/formatTime';

interface PostHeaderContentProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostContent({ post, onProfilePress, onMorePress }: PostHeaderContentProps) {
    return (
        <div className="px-4 py-4">
            {/* Title and more options */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-medium pr-2 flex-1">{post.title}</h1>
                {post.isWriter && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMorePress();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full shrink-0"
                    >
                        <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
                    </button>
                )}
            </div>

            {/* Profile section */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onProfilePress(post.userId)}
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                            src="/images/default-profile.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-base font-medium text-gray-900">{post.userNickname}</p>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <span>{formatTimeAgo(post.createdAt)}</span>
                            <span>·</span>
                            <span>조회 {post.views}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post content */}
            <div className="mt-4">
                <p className="text-base leading-relaxed">{post.content}</p>
            </div>
        </div>
    );
}