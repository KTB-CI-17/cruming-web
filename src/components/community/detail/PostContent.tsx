import { Post } from '../../../types/community';

interface PostContentProps {
    post: Post;
}

export default function PostContent({ post }: PostContentProps) {
    return (
        <div className="px-4">
            <h1 className="text-xl font-medium mb-2">{post.title}</h1>
            {post.location && (
                <div className="text-sm text-gray-600 mb-2">
                    📍 {post.location}
                </div>
            )}
            {post.level && (
                <div className="text-sm text-gray-600 mb-4">
                    🎯 난이도: {post.level}
                </div>
            )}
            <p className="text-base leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>
        </div>
    );
}