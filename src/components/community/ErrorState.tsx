import React from 'react';

interface ErrorStateProps {
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <p className="text-base text-gray-600 mb-4">
                게시글을 불러오는데 실패했습니다.
            </p>
            <button
                onClick={onRetry}
                className="px-6 py-2 text-sm text-white rounded-full bg-[#826CF6]"
            >
                다시 시도
            </button>
        </div>
    );
};

export default ErrorState;