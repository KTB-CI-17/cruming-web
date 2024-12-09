interface DotProps {
    color: string;
    className?: string;
}

export function Dot({ color, className = '' }: DotProps) {
    const isWhite = color === '#FAFAFA';

    if (isWhite) {
        return (
            <div className={`mr-2 ${className}`}>
                <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full border border-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`w-3 h-3 rounded-full mr-2 ${className}`}
            style={{
                border: `3px solid ${color}`,
                backgroundColor: 'transparent'
            }}
        />
    );
}