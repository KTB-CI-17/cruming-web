// src/hooks/hold/useHoldAnalysis.ts
import { useState } from 'react';
import { AnalysisResponse } from '../../types/hold';

export const useHoldAnalysis = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        try {
            setError(null);
            setAnalysisComplete(false);
            setAnalysisResult(null);
            setSelectedImage(file);
            setImageUrl(URL.createObjectURL(file));
        } catch (err) {
            setError('이미지 선택 중 오류가 발생했습니다.');
            console.error('Error selecting image:', err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage || !imageUrl) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);

            const response = await fetch('https://cruming.site/ai/detect', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const formattedResult: AnalysisResponse = {
                info: {
                    date_created: new Date().toISOString(),
                    image_path: imageUrl,
                    total_objects: data.holds?.length || 0
                },
                objects: data.holds.map((hold: any, index: number) => ({
                    object_id: index,
                    area: 0,
                    center_point: {
                        x: (hold.coordinates.x1 + hold.coordinates.x2) / 2,
                        y: (hold.coordinates.y1 + hold.coordinates.y2) / 2
                    },
                    num_points: 4, // 사각형이므로 4개의 점
                    points: [
                        [hold.coordinates.x1, hold.coordinates.y1],
                        [hold.coordinates.x2, hold.coordinates.y1],
                        [hold.coordinates.x2, hold.coordinates.y2],
                        [hold.coordinates.x1, hold.coordinates.y2]
                    ]
                }))
            };

            setAnalysisResult(formattedResult);
            setAnalysisComplete(true);
        } catch (error) {
            console.error('Error during image analysis:', error);
            setError('이미지 분석 중 문제가 발생했습니다. 다시 시도해주세요.');
            setAnalysisComplete(false);
            setAnalysisResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setImageUrl(null);
        setIsLoading(false);
        setAnalysisComplete(false);
        setAnalysisResult(null);
        setError(null);
    };

    return {
        selectedImage,
        imageUrl,
        isLoading,
        analysisComplete,
        analysisResult,
        error,
        handleImageSelect,
        handleSubmit,
        resetAnalysis
    };
};