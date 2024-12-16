import { useState, useEffect } from 'react';
import {FollowsResponse, FollowUser} from "../../types/user";
import {api} from "../../config/axios";

export const useFollows = (userId: string, type: 'followers' | 'following') => {
    const [users, setUsers] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchUsers = async (pageNumber: number) => {
        try {
            setLoading(true);
            // userId가 빈 문자열이면 본인의 팔로우 목록을 조회
            const endpoint = type === 'followers'
                ? `/follows/followers/${userId || 'me'}`
                : `/follows/followings/${userId || 'me'}`;

            const response = await api.get<FollowsResponse>(endpoint, {
                params: {
                    page: pageNumber,
                    size: 20
                }
            });

            if (pageNumber === 0) {
                setUsers(response.data.content);
            } else {
                setUsers(prev => [...prev, ...response.data.content]);
            }

            setHasMore(!response.data.last);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch users'));
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(nextPage);
        }
    };

    useEffect(() => {
        setPage(0);
        setUsers([]);
        setHasMore(true);
        fetchUsers(0);
    }, [userId, type]);

    return {
        users,
        loading,
        error,
        hasMore,
        loadMore
    };
};