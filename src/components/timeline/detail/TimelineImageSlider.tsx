import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface TimelineImageSliderProps {
    files: string[];
    onImageIndexChange: (index: number) => void;
}

export default function TimelineImageSlider({
                                                files,
                                                onImageIndexChange
                                            }: TimelineImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (files.length === 0) return null;

    const handlePrevious = () => {
        const newIndex = currentIndex === 0 ? files.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        onImageIndexChange(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex === files.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        onImageIndexChange(newIndex);
    };

    const getImageUrl = (file: any): string => {
        if (typeof file === 'string') return file;
        return file.url || file.path || file.src || '';
    };

    return (
        <div className="relative w-full aspect-square bg-white mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={getImageUrl(files[currentIndex])}
                    alt={`Slide ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            {files.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                        {files.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                    currentIndex === index ? 'bg-gray-700' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}