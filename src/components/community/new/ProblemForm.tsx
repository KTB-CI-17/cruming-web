import React from "react";
import {LocationData} from "../../../types/location.ts";
import LocationSearch from "../../common/LocationSearch.tsx";

interface ProblemFormContentProps {
    title: string;
    content: string;
    level: string;
    location: LocationData | null;
    image: {
        file: File;
        preview: string;
    } | null;
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
    onLevelChange: (level: string) => void;
    onLocationChange: (location: LocationData) => void;
    isLoading?: boolean;
}

export const ProblemForm = ({
                                title,
                                content,
                                level,
                                location,
                                image,
                                onTitleChange,
                                onContentChange,
                                onLevelChange,
                                onLocationChange,
                                isLoading = false
                            }: ProblemFormContentProps) => {
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        onContentChange(e.target.value);
    };

    return (
        <div className="p-4 h-full overflow-auto">
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    maxLength={100}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-base border-b border-gray-100 focus:outline-none disabled:bg-gray-50"
                />

                <LocationSearch
                    value={location?.placeName || ''}
                    onLocationSelect={onLocationChange}
                />

                <input
                    type="text"
                    placeholder="난이도를 입력하세요"
                    value={level}
                    onChange={(e) => onLevelChange(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-base border-b border-gray-100 focus:outline-none disabled:bg-gray-50"
                />

                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={handleTextAreaChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-base border-none focus:outline-none disabled:bg-gray-50 resize-none min-h-[120px]"
                />
            </div>

            <div className="w-full mt-4">
                {image ? (
                    <div className="w-full">
                        <img
                            src={image.preview}
                            alt="Problem"
                            className="w-full"
                        />
                    </div>
                ) : (
                    <div className="w-full h-[200px] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        문제 이미지가 필요합니다
                    </div>
                )}
            </div>
        </div>
    );
};