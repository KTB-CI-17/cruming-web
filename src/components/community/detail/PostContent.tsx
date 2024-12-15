import { Post } from '../../../types/community';
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { formatTimeAgo } from '../../../utils/formatTime';
import ProfileAvatar from '../../common/ProfileAvatar';

interface PostHeaderContentProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostContent({ post, onProfilePress, onMorePress }: PostHeaderContentProps) {
    return (
        <div className="px-4 py-4">
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

            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-3"
                    onClick={() => onProfilePress(post.userId)}
                >
                    <ProfileAvatar
                        userProfile={post.userProfile}
                        userNickname={post.userNickname}
                        userId={post.userId}
                        size="md"
                        onClick={() => onProfilePress(post.userId)}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-base font-medium text-gray-900">{post.userNickname}</p>
                            {post.instagram_id && (
                                <span className="text-sm text-gray-500">@{post.instagram_id}</span>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <span>{formatTimeAgo(post.createdAt)}</span>
                            <span>·</span>
                            <span>조회 {post.views}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-base leading-relaxed">{post.content}</p>
            </div>
        </div>
    );
}