import { UploadImage } from '../../../types/community';
import { ImageUploadArea } from './ImageUploadArea';

interface GeneralFormProps {
    title: string;
    content: string;
    images: UploadImage[];
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
    onImagesChange: (images: UploadImage[]) => void;
    onFileDelete?: (fileId: number) => void;  // 파일 삭제 핸들러 추가
    isLoading: boolean;
}

export const GeneralForm = ({
                                title,
                                content,
                                images,
                                onTitleChange,
                                onContentChange,
                                onImagesChange,
                                onFileDelete,
                                isLoading
                            }: GeneralFormProps) => {
    const handleImagesChange = (newImages: UploadImage[]) => {
        // 기존 이미지가 삭제된 경우 onFileDelete 호출
        const deletedImages = images.filter(img =>
            img.id && !newImages.find(newImg => newImg.id === img.id)
        );
        deletedImages.forEach(img => {
            if (img.id && onFileDelete) {
                onFileDelete(img.id);
            }
        });

        onImagesChange(newImages);
    };

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
                    onImagesChange={handleImagesChange}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};