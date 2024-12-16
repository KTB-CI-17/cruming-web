import {FollowUser} from "../../types/user";

interface UserListItemProps {
    user: FollowUser;
}

export const UserListItem = ({ user }: UserListItemProps) => {
    return (
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <img
                src={user.profileUrl || '/default-profile.png'}
                alt={user.nickname}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <p className="font-medium text-gray-900">{user.nickname}</p>
                {user.instagramId && (
                    <p className="text-sm text-gray-500">@{user.instagramId}</p>
                )}
            </div>
        </div>
    );
};