import { useState } from 'react';
import { AnalysisResponse } from '../types/hold';

export const useHoldAnalysis = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        try {
            // Reset states
            setError(null);
            setAnalysisComplete(false);
            setAnalysisResult(null);

            // Update image states
            setSelectedImage(file);
            setImageUrl(URL.createObjectURL(file));
        } catch (err) {
            setError('이미지 선택 중 오류가 발생했습니다.');
            console.error('Error selecting image:', err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedImage);

            const response = await fetch('http://3.35.176.227:8000/detect', {
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

            // API 응답을 AnalysisResponse 형식에 맞게 변환
            const formattedResult: AnalysisResponse = {
                detections: data.holds || [],
                imageUrl: imageUrl!,
                message: data.message || '분석이 완료되었습니다.',
                status: data.status || 'success'
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