import { useState, useEffect } from 'react';
import { ImageInfo, UseImageProcessingReturn } from '../types/hold';

export const useImageProcessing = (imageUri: string): UseImageProcessingReturn => {
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [layoutInfo, setLayoutInfo] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        if (!layoutInfo) return;

        const img = new Image();
        img.src = imageUri;
        img.onload = () => {
            const containerWidth = layoutInfo.width;
            const containerHeight = layoutInfo.height;
            const imageRatio = img.width / img.height;
            const containerRatio = containerWidth / containerHeight;

            let displayWidth, displayHeight, offsetX, offsetY;

            if (imageRatio > containerRatio) {
                displayWidth = containerWidth;
                displayHeight = containerWidth / imageRatio;
                offsetX = 0;
                offsetY = (containerHeight - displayHeight) / 2;
            } else {
                displayHeight = containerHeight;
                displayWidth = containerHeight * imageRatio;
                offsetX = (containerWidth - displayWidth) / 2;
                offsetY = 0;
            }

            setImageInfo({
                originalWidth: img.width,
                originalHeight: img.height,
                displayWidth,
                displayHeight,
                offsetX,
                offsetY
            });
        };
    }, [layoutInfo, imageUri]);

    const calculateScaledCoordinates = () => {
        if (!imageInfo) return { left: 0, top: 0, width: 0, height: 0 };

        const { originalWidth, originalHeight, displayWidth, displayHeight, offsetX, offsetY } = imageInfo;
        const scaleX = displayWidth / originalWidth;
        const scaleY = displayHeight / originalHeight;

        return {
            left: coordinates.x1 * scaleX + offsetX,
            top: coordinates.y1 * scaleY + offsetY,
            width: (coordinates.x2 - coordinates.x1) * scaleX,
            height: (coordinates.y2 - coordinates.y1) * scaleY,
        };
    };

    return {
        imageInfo,
        layoutInfo,
        setLayoutInfo,
        calculateScaledCoordinates,
    };
};