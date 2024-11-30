import { ChangeEvent } from 'react';
import { ImageUploadAreaProps, UploadImage } from '../../../types/community';
import { Camera, X } from "lucide-react";

export const ImageUploadArea = ({ images, onImagesChange, disabled = false }: ImageUploadAreaProps) => {
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const totalSelected = files.length;
        const remainingSlots = 5 - images.length;

        if (totalSelected > 5) {
            alert('이미지는 한 번에 최대 5개까지만 선택할 수 있습니다.');
            e.target.value = '';  // 입력 필드 초기화
            return;
        }

        if (remainingSlots <= 0) {
            alert('이미지는 최대 5개까지만 업로드할 수 있습니다.');
            e.target.value = '';  // 입력 필드 초기화
            return;
        }

        const newImages: UploadImage[] = Array.from(files)
            .slice(0, remainingSlots)
            .map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));

        if (files.length > remainingSlots) {
            alert(`현재 ${remainingSlots}개의 이미지만 추가 가능합니다.`);
        }

        onImagesChange([...images, ...newImages]);
        e.target.value = '';  // 입력 필드 초기화
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    return (
        <div className="relative overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max pr-2">
                {images.length < 5 && (
                    <div className="shrink-0">
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            multiple
                            onChange={handleImageUpload}
                            disabled={disabled}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className={`w-[104px] h-[104px] border border-dashed border-primary rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Camera className="w-8 h-8 text-primary" />
                            <span className="text-sm text-primary">{images.length}/5</span>
                        </label>
                    </div>
                )}

                {images.map((image, index) => (
                    <div key={image.preview} className="relative shrink-0 w-[104px] h-[104px] group">
                        <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                            disabled={disabled}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};