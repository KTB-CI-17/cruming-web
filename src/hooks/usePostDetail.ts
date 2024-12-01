import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import {api} from "../config/axios.ts";
import {Post} from "../types/community.ts";

export function usePost(postId: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get<Post>(`/posts/${postId}`);
            setPost(data);
            return data;
        } catch (e) {
            const error = e as AxiosError;
            const message = error.response?.status === 404
                ? "게시글을 찾을 수 없습니다."
                : "게시글을 불러오는데 실패했습니다.";
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    const deletePost = useCallback(async () => {
        if (!post) return;

        try {
            await api.delete(`/posts/${post.id}`);
            return true;
        } catch (error) {
            console.error(error);
            throw new Error("삭제에 실패했습니다.");
        }
    }, [post]);

    const togglePostLike = useCallback(async () => {
        if (!post) return false;

        try {
            const { data } = await api.post<boolean>(`/posts/${post.id}/likes`);
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    isLiked: data,
                    likeCount: data ? prev.likeCount + 1 : prev.likeCount - 1
                };
            });
            return data;
        } catch (error) {
            console.error(error);
            throw new Error("좋아요 처리에 실패했습니다.");
        }
    }, [post]);

    return {
        post,
        isLoading,
        error,
        fetchPost,
        deletePost,
        togglePostLike,
        setPost
    };
}