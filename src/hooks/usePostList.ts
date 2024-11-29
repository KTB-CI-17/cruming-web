import { useState, useCallback, useRef, useEffect } from 'react';
import { ListPost, PostCategory } from '../types/community';
import axios from 'axios';
import {Post} from "../services/post";

interface UsePostListProps {
    category: PostCategory;
    pageSize?: number;
}

export const usePostList = ({ category, pageSize = 10 }: UsePostListProps) => {
    const [posts, setPosts] = useState<ListPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const isLoadingMoreRef = useRef(false);

    useEffect(() => {
        setPosts([]);
        setPageNumber(0);
        setHasMore(true);
        setError(null);
        isLoadingMoreRef.current = false;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, [category]);

    const fetchPosts = useCallback(async (page: number, isRefresh: boolean = false) => {
        if (isLoadingMoreRef.current || (!isRefresh && !hasMore)) {
            return;
        }

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

            if (!isMountedRef.current) return;

            const newPosts = response.content;

            if (isRefresh) {
                setPosts(newPosts);
            } else {
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(post => post.id));
                    const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
                    return [...prevPosts, ...uniqueNewPosts];
                });
            }

            setHasMore(!response.last && newPosts.length > 0);
            setPageNumber(page);

        } catch (error) {
            if (!isMountedRef.current) return;

            if (axios.isCancel(error)) {
                return;
            }
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
        fetchPosts(0, true);

        return () => {
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
    }, [fetchPosts]);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMoreRef.current && hasMore && !isRefreshing) {
            const nextPage = pageNumber + 1;
            fetchPosts(nextPage, false);
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