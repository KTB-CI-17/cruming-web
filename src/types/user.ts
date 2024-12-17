export interface UserProfile {
    id: number;
    nickname: string;
    height?: number;
    armReach?: number;
    intro?: string;
    homeGym?: string;
    instagramId?: string;
    profile?: string;
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

export interface FollowUser {
    id: number;
    nickname: string;
    profileUrl: string;
    instagramId: string;
}

export interface FollowsResponse {
    content: FollowUser[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
}

export interface HomeGymRequest {
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface UserEditRequest {
    nickname: string;
    height?: number;
    armReach?: number;
    intro?: string;
    instagramId?: string;
    homeGymRequest?: HomeGymRequest;
}

export interface UserEditInfo {
    profileImageUrl: string;
    nickname: string;
    height?: number;
    armReach?: number;
    intro?: string;
    instagramId?: string;
    homeGym: {
        placeName: string;
        address: string;
        latitude: number;
        longitude: number;
    } | null;
}