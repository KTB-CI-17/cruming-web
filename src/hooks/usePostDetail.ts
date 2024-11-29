import { Post } from '../types/community';
import { api } from '../config/axios';

export const usePostDetail = () => ({
    fetchPost: async (postId: string): Promise<Post> => {
        const { data } = await api.get(`/posts/${postId}`);
        return data;
    },

    deletePost: async (postId: number) => {
        await api.delete(`/posts/${postId}`);
    },

    togglePostLike: async (postId: number): Promise<boolean> => {
        const { data } = await api.post(`/posts/${postId}/likes`);
        return data;
    },

    fetchReplies: async (postId: string, page = 0, size = 10) => {
        const { data } = await api.get(
            `/posts/${postId}/replies?page=${page}&size=${size}&sort=createdAt,asc`
        );
        return data;
    },

    fetchChildReplies: async (parentId: number, page = 0) => {
        const { data } = await api.get(
            `/posts/replies/${parentId}/children?page=${page}&size=5&sort=createdAt,asc`
        );
        return data;
    },

    createReply: async (postId: string, content: string, parentId?: number | null) => {
        const url = parentId ? `/posts/${postId}/replies/${parentId}` : `/posts/${postId}/replies`;
        const { data } = await api.post(url, { content });
        return data;
    },

    updateReply: async (replyId: number, content: string) => {
        const { data } = await api.put(`/posts/replies/${replyId}`, { content });
        return data;
    },

    deleteReply: async (replyId: number) => {
        await api.delete(`/posts/replies/${replyId}`);
    }
});