import { PostFormContentProps } from '../../../types/community';
import { ImageUploadArea } from './ImageUploadArea';

export const GeneralForm = ({
                                    title,
                                    content,
                                    images,
                                    onTitleChange,
                                    onContentChange,
                                    onImagesChange,
                                    isLoading
                                }: PostFormContentProps) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    maxLength={100}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-base border-b border-gray-100 focus:outline-none disabled:bg-gray-50"
                />

                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-base border-none focus:outline-none disabled:bg-gray-50 resize-none"
                    style={{height: "88%"}}
                />
            </div>

            <div className="p-0 pt-4 border-t border-gray-100">
                <ImageUploadArea
                    images={images}
                    onImagesChange={onImagesChange}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};