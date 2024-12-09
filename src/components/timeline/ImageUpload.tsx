import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUpload({
                                        images,
                                        onChange,
                                        maxImages = 5
                                    }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const remainingSlots = maxImages - images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        const processFile = (file: File): Promise<string> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        };

        Promise.all(filesToProcess.map(processFile))
            .then(newImages => {
                onChange([...images, ...newImages]);
            });

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <div className="flex overflow-x-auto gap-3 pb-2">
                {images.length < maxImages && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 w-[100px] h-[100px] border-2 border-dashed border-[#735BF2] rounded-lg
                                 flex flex-col items-center justify-center text-[#735BF2]"
                    >
                        <Camera className="w-8 h-8" />
                        <span className="text-xs mt-1">
                            {images.length}/{maxImages}
                        </span>
                    </button>
                )}

                {images.map((image, index) => (
                    <div key={index} className="relative flex-shrink-0">
                        <img
                            src={image}
                            alt={`업로드 이미지 ${index + 1}`}
                            className="w-[100px] h-[100px] rounded-lg object-cover"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md
                                     text-[#735BF2] hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                />
            </div>
        </div>
    );
}