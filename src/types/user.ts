export interface UserProfile {
    id: number;
    nickname: string;
    height?: number;
    armReach?: number;
    intro?: string;
    homeGym?: string;
    instagramId?: string;
    userProfile?: string;
    followingCount: number;
    followerCount: number;
    isMe: boolean;
    isFollowing?: boolean;
    isFollowingMe?: boolean;
}

export interface UserInfoResponse {
    id: number;
    nickname: string;
    height: number | null;
    armReach: number | null;
    intro: string | null;
    homeGym: string | null;
    instagramId: string | null;
    followingCount: number;
    followerCount: number;
    isMe: boolean;
}