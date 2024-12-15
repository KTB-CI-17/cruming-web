interface ProfileAvatarProps {
    userProfile?: string;
    userNickname: string;
    userId: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onClick?: () => void;
    className?: string;
}

export default function ProfileAvatar({
                                          userProfile,
                                          userNickname,
                                          userId,
                                          size = 'md',
                                          onClick,
                                          className = ''
                                      }: ProfileAvatarProps) {
    // 사용자 ID를 기반으로 일관된 색상을 반환하는 함수
    const getBackgroundColor = (userId: number) => {
        const colors = [
            'bg-red-500',
            'bg-yellow-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-indigo-500',
            'bg-purple-500',
            'bg-pink-500'
        ];
        return colors[userId % colors.length];
    };

    // 닉네임의 첫 글자를 가져오는 함수
    const getInitial = (nickname: string) => {
        return nickname.charAt(0).toUpperCase();
    };

    // 크기별 스타일 매핑
    const sizeStyles = {
        sm: {
            container: 'w-8 h-8',
            text: 'text-sm'
        },
        md: {
            container: 'w-10 h-10',
            text: 'text-base'
        },
        lg: {
            container: 'w-16 h-16',
            text: 'text-xl'
        },
        xl: {
            container: 'w-[120px] h-[120px]',
            text: 'text-4xl'
        }
    };

    const containerClass = `${sizeStyles[size].container} rounded-full overflow-hidden shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`;

    return (
        <div
            className={containerClass}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
        >
            {userProfile ? (
                <img
                    src={userProfile}
                    alt={`${userNickname}님의 프로필`}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className={`w-full h-full flex items-center justify-center text-white ${getBackgroundColor(userId)}`}>
                    <span className={`font-medium ${sizeStyles[size].text}`}>
                        {getInitial(userNickname)}
                    </span>
                </div>
            )}
        </div>
    );
}