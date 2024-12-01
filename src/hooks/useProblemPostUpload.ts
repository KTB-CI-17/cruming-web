import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { LocationData } from '../types/location';
import { multipartApi } from '../config/axios';

interface UseUploadProblemOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface ProblemUploadRequest {
    title: string;
    content: string;
    location: {
        placeName: string;
        address: string;
        latitude: number;
        longitude: number;
    };
    level: string;
    file: {
        originalFileName: string;
        displayOrder: number;
    };
}

export const useUploadProblem = (options: UseUploadProblemOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateImage = (image: File): boolean => {
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return ALLOWED_TYPES.includes(image.type);
    };

    const getFileExtension = (file: File): string => {
        const extensions: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp'
        };
        return extensions[file.type] || '';
    };

    const uploadProblem = async (
        title: string,
        content: string,
        level: string,
        location: LocationData,
        image: { file: File; preview: string }
    ) => {
        try {
            if (!title.trim()) {
                throw new Error('제목을 입력해주세요.');
            }

            if (!content.trim()) {
                throw new Error('내용을 입력해주세요.');
            }

            if (!level.trim()) {
                throw new Error('난이도를 입력해주세요.');
            }

            if (!image || !validateImage(image.file)) {
                throw new Error('올바른 이미지 파일을 업로드해주세요. (지원 형식: JPG, PNG, GIF, WEBP)');
            }

            setIsLoading(true);
            const formData = new FormData();

            // Create request data
            const requestData: ProblemUploadRequest = {
                title: title.trim(),
                content: content.trim(),
                location: {
                    placeName: location.placeName,
                    address: location.roadAddress,
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                level: level.trim(),
                file: {
                    originalFileName: `problem_image.${getFileExtension(image.file)}`,
                    displayOrder: 0
                }
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            // Add file
            formData.append('file', image.file);

            await multipartApi.post('/posts/problems', formData);
            options.onSuccess?.();
            navigate('/community');
        } catch (error) {
            console.error('Problem upload error:', error);
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || '문제 등록에 실패했습니다.';
            } else {
                errorMessage = '알 수 없는 오류가 발생했습니다.';
            }

            options.onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        uploadProblem,
        isLoading
    };
};