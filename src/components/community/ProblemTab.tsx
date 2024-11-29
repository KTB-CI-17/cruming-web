import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { usePostList } from '../../hooks/usePostList';
import ErrorState from "./ErrorState.tsx";

const ProblemTab = () => {
    const navigate = useNavigate();
    const {
        posts,
        isLoading,
        error,
        hasMore,
        handleLoadMore,
        handleRetry
    } = usePostList({ category: 'PROBLEM' });

    const handlePostClick = useCallback((id: number) => {
        navigate(`/community/${id}`);
    }, [navigate]);

    if (isLoading && posts.length === 0) {
        return <div className="p-4 text-center">로딩 중...</div>;
    }

    if (error) {
        return <ErrorState onRetry={handleRetry} />;
    }

    return (
        <div>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                />
            ))}
            {hasMore && (
                <div className="p-4 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="text-[#8F9BB3]"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProblemTab;