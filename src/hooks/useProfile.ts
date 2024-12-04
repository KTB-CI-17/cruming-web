import { useState, useEffect } from 'react';
import { UserProfile, UserInfoResponse } from '../types/user';
import {api} from "../config/axios";

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

    const handleFollow = async () => {
        if (!profile) return;

        try {
            const isFollowing = !profile.isFollowing;
            await api.post(`/users/${profile.id}/follow`);
            setProfile(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    followerCount: isFollowing ? prev.followerCount + 1 : prev.followerCount - 1,
                    isFollowing
                };
            });
        } catch (err) {
            console.error('Failed to update follow status:', err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    return {
        profile,
        loading,
        error,
        handleFollow
    };
};