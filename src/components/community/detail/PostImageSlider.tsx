import { useState } from 'react';
import { File } from '../../../types/community';

interface PostImageSliderProps {
    files: File[];
    imagesCache: { [key: string]: string };
    onImageIndexChange: (index: number) => void;
}

export default function PostImageSlider({ files, imagesCache, onImageIndexChange }: PostImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (files.length === 0) return null;

    const cachedImages = files
        .map(file => imagesCache[file.url])
        .filter((url): url is string => url != null);

    if (cachedImages.length === 0) return null;

    const handleScroll = (index: number) => {
        setCurrentIndex(index);
        onImageIndexChange(index);
    };

    return (
        <div className="relative w-full">
            <div className="flex overflow-x-auto snap-x snap-mandatory">
                {cachedImages.map((uri, index) => (
                    <div key={index} className="flex-none w-full snap-center">
                        <img
                            src={uri}
                            alt={`Image ${index + 1}`}
                            className="w-full h-[400px] object-contain"
                        />
                    </div>
                ))}
            </div>

            {cachedImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {cachedImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleScroll(index)}
                            className={`w-1.5 h-1.5 rounded-full ${
                                currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}