import { useState, useEffect } from 'react';
import { UserProfile, UserInfoResponse } from '../types/user';
import { api } from "../config/axios";

export const useProfile = (userId?: string) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get<UserInfoResponse>(`/users/${userId || ''}`);
            setProfile({
                ...response.data,
                height: response.data.height || undefined,
                armReach: response.data.armReach || undefined,
                intro: response.data.intro || undefined,
                homeGym: response.data.homeGym || undefined,
                instagramId: response.data.instagramId || undefined,
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async () => {
        if (!profile) return;

        try {
            const response = await api.patch<boolean>(`/follows/toggle/${profile.id}`);
            const isFollowing = response.data;

            setProfile(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    followerCount: isFollowing ? prev.followerCount + 1 : prev.followerCount - 1,
                    isFollowing
                };
            });
        } catch (err) {
            console.error('팔로우 상태 업데이트 실패:', err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    return {
        profile,
        loading,
        error,
        toggleFollow
    };
};