import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserListItem } from "../../components/profile/UserListItem";
import { useFollows } from "../../hooks/profile/useFollows";

export const Follows = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

    const { users, loading, hasMore, loadMore } = useFollows(userId || '', activeTab);

    const handleUserClick = (userId: number | string) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="flex flex-col h-full bg-white page-container">
            <div className="max-w-screen-sm mx-auto w-full">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('followers')}
                        className={`flex-1 py-4 text-center ${
                            activeTab === 'followers'
                                ? 'text-[#735BF2] border-b-2 border-[#735BF2] font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        팔로워
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 py-4 text-center ${
                            activeTab === 'following'
                                ? 'text-[#735BF2] border-b-2 border-[#735BF2] font-semibold'
                                : 'text-gray-500'
                        }`}
                    >
                        팔로잉
                    </button>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto">
                    {users.map((user) => (
                        <div key={user.id} onClick={() => handleUserClick(user.id)} className="cursor-pointer">
                            <UserListItem user={user} />
                        </div>
                    ))}

                    {loading && (
                        <div className="p-4 text-center text-gray-500">
                            불러오는 중...
                        </div>
                    )}

                    {!loading && hasMore && (
                        <button
                            onClick={loadMore}
                            className="w-full p-4 text-[#735BF2]"
                        >
                            더 보기
                        </button>
                    )}

                    {!loading && users.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            {activeTab === 'followers' ? '팔로워가' : '팔로잉하는 사용자가'} 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Follows;