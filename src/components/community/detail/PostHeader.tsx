import { Post } from '../../../types/community';

interface PostHeaderProps {
    post: Post;
    onProfilePress: (userId: number) => void;
    onMorePress: () => void;
}

export default function PostHeader({ post, onProfilePress, onMorePress }: PostHeaderProps) {
    return (
        <div className="flex justify-between items-center p-4">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => onProfilePress(post.userId)}
            >
                <img
                    src="/default-profile.png"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-bold text-base">{post.userNickname}</p>
                    {post.instagram_id && (
                        <p className="text-sm text-gray-600">@{post.instagram_id}</p>
                    )}
                </div>
            </div>
            {post.isWriter && (
                <button
                    onClick={onMorePress}
                    className="p-2 text-gray-600 hover:text-gray-800"
                >
                    ⋮
                </button>
            )}
        </div>
    );
}

