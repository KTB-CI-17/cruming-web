import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { LocationData } from '../../types/location';
import { multipartApi } from '../../config/axios';

export type PostCategory = 'GENERAL' | 'PROBLEM';

export interface CreatePostRequest {
    category: PostCategory;
    title: string;
    content: string;
    locationRequest?: {
        placeName: string;
        address: string;
        latitude: number;
        longitude: number;
    } | null;
    level?: string | null;
    fileRequests: {
        originalFileName: string;
        displayOrder: number;
    }[];
}

interface UploadImage {
    file: File;
    preview: string;
}

interface UsePostUploadOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const usePostUpload = (options: UsePostUploadOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateImage = (file: File): boolean => {
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return ALLOWED_TYPES.includes(file.type);
    };

    const validateImages = (images: UploadImage[] | UploadImage): boolean => {
        if (Array.isArray(images)) {
            return images.every(image => validateImage(image.file));
        }
        return validateImage(images.file);
    };

    const uploadPost = async (
        category: PostCategory,
        title: string,
        content: string,
        images: UploadImage[] | UploadImage,
        location?: LocationData | null,
        level?: string | null
    ) => {
        try {
            if (!title.trim()) {
                throw new Error('제목을 입력해주세요.');
            }

            if (!content.trim()) {
                throw new Error('내용을 입력해주세요.');
            }

            if (category === 'PROBLEM') {
                if (!level?.trim()) {
                    throw new Error('난이도를 입력해주세요.');
                }
                if (!location) {
                    throw new Error('위치를 선택해주세요.');
                }
                if (!images || !validateImages(images)) {
                    throw new Error('올바른 이미지 파일을 업로드해주세요. (지원 형식: JPG, PNG, GIF, WEBP)');
                }
            } else if (Array.isArray(images) && images.length > 0 && !validateImages(images)) {
                throw new Error('지원하지 않는 이미지 형식이 포함되어 있습니다. (지원 형식: JPG, PNG, GIF, WEBP)');
            }

            setIsLoading(true);
            const formData = new FormData();

            const imageArray = Array.isArray(images) ? images : [images];

            const requestData: CreatePostRequest = {
                category,
                title: title.trim(),
                content: content.trim(),
                locationRequest: location ? {
                    placeName: location.placeName,
                    address: location.address,
                    latitude: location.latitude,
                    longitude: location.longitude
                } : null,
                level: level?.trim() ?? null,
                fileRequests: imageArray.map((image, index) => ({
                    originalFileName: image.file.name,
                    displayOrder: index
                }))
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            // 파일 추가
            imageArray.forEach(image => {
                formData.append('files', image.file);
            });

            // 디버깅을 위한 로그
            console.log('Request Data:', {
                ...requestData,
                files: imageArray.map(image => ({
                    name: image.file.name,
                    type: image.file.type,
                    size: image.file.size
                }))
            });

            const response = await multipartApi.post('/posts', formData);
            console.log('Upload Response:', response);

            options.onSuccess?.();
            navigate('/community');
        } catch (error) {
            console.error('Post upload error:', error);
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || '게시글 등록에 실패했습니다.';
            } else {
                errorMessage = '알 수 없는 오류가 발생했습니다.';
            }

            options.onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        uploadPost,
        isLoading
    };
};