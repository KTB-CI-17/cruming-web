import { useNavigate } from 'react-router-dom';

interface ProfileStatsProps {
    userId?: number;
    followers: number;
    following: number;
    isMe: boolean;
}

export const FollowCountArea: React.FC<ProfileStatsProps> = ({
                                                                 userId,
                                                                 followers,
                                                                 following,
                                                                 isMe
                                                             }) => {
    const navigate = useNavigate();

    const handleFollowsClick = () => {
        if (isMe || !userId) {
            navigate('/follows');
        } else {
            navigate(`/follows/${userId}`);
        }
    };

    return (
        <div className="flex items-center justify-center gap-8 bg-white rounded-lg p-2">
            <div
                className="flex items-center justify-center cursor-pointer active:opacity-70"
                onClick={handleFollowsClick}
            >
                <div className="text-center">
                    <span className="text-gray-600 text-sm">팔로워</span>
                    {' '}
                    <span className="font-bold text-gray-900">{followers}</span>
                </div>
            </div>
            <div className="w-px h-5 bg-gray-200" />
            <div
                className="flex items-center justify-center cursor-pointer active:opacity-70"
                onClick={handleFollowsClick}
            >
                <div className="text-center">
                    <span className="text-gray-600 text-sm">팔로잉</span>
                    {' '}
                    <span className="font-bold text-gray-900">{following}</span>
                </div>
            </div>
        </div>
    );
};