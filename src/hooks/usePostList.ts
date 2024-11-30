import { api } from '../config/axios';
import { PostCategory, PostListResponse, ListPost } from '../types/community';
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

interface GetPostsParams {
    page: number;
    size: number;
    category: PostCategory;
}

interface UsePostListProps {
    category: PostCategory;
    pageSize?: number;
}

export const Post = {
    getPosts: async (params: GetPostsParams): Promise<PostListResponse> => {
        const response = await api.get<PostListResponse>('/posts', { params });
        return response.data;
    }
};

export const usePostList = ({ category, pageSize = 15 }: UsePostListProps) => {
    const [posts, setPosts] = useState<ListPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const isLoadingMoreRef = useRef(false);

    const fetchPosts = useCallback(async (page: number, isRefresh: boolean = false) => {
        if (isLoadingMoreRef.current || (!isRefresh && !hasMore)) return;

        try {
            isLoadingMoreRef.current = !isRefresh;
            setIsLoading(isRefresh);
            setError(null);

            abortControllerRef.current = new AbortController();
            const response = await Post.getPosts({
                page,
                size: pageSize,
                category
            });
            console.log('API Response:', response);

            if (!isMountedRef.current) return;

            const newPosts = response.content;

            setPosts(prevPosts => {
                if (isRefresh) return newPosts;
                const existingIds = new Set(prevPosts.map(post => post.id));
                const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
                return [...prevPosts, ...uniqueNewPosts];
            });

            setHasMore(!response.last && newPosts.length > 0);
            setPageNumber(page);

        } catch (error) {
            if (!isMountedRef.current || axios.isCancel(error)) return;

            setError('게시글을 불러오는데 실패했습니다.');
            setHasMore(false);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
                setIsRefreshing(false);
                isLoadingMoreRef.current = false;
            }
        }
    }, [category, pageSize, hasMore]);

    useEffect(() => {
        isMountedRef.current = true;
        let ignore = false;

        const fetchInitialPosts = async () => {
            await fetchPosts(0, true);
            if (ignore) return;
        };

        fetchInitialPosts();

        return () => {
            ignore = true;
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [category]);

    const handleRefresh = useCallback(() => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setPageNumber(0);
        setHasMore(true);
        fetchPosts(0, true);
    }, [fetchPosts, isRefreshing]);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMoreRef.current && hasMore && !isRefreshing) {
            fetchPosts(pageNumber + 1, false);
        }
    }, [pageNumber, fetchPosts, hasMore, isRefreshing]);

    const handleRetry = useCallback(() => {
        if (isLoading) return;
        setPageNumber(0);
        setHasMore(true);
        fetchPosts(0, true);
    }, [fetchPosts, isLoading]);

    return {
        posts,
        isLoading,
        isRefreshing,
        isLoadingMore: isLoadingMoreRef.current,
        error,
        hasMore,
        handleRefresh,
        handleLoadMore,
        handleRetry
    };
};