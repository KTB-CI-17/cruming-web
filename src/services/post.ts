import { apiClient } from '../config/axios';
import { PostCategory, PostListResponse } from '../types/community';

interface GetPostsParams {
    page: number;
    size: number;
    category: PostCategory;
}

export const Post = {
    getPosts: async (params: GetPostsParams): Promise<PostListResponse> => {
        const response = await apiClient.get<PostListResponse>('/api/v1/posts', { params });
        return response.data;
    }
};