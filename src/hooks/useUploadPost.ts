import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import {CreatePostRequest, UploadImage} from "../types/community.ts";
import {multipartApi} from "../config/axios.ts";

interface UseUploadPostOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

// 허용된 파일 타입 정의
const ALLOWED_FILE_TYPES = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp']
} as const;

export const useUploadPost = (options: UseUploadPostOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateImages = (images: UploadImage[]): boolean => {
        return images.every(image => {
            const fileType = image.file.type;
            return Object.keys(ALLOWED_FILE_TYPES).includes(fileType);
        });
    };

    const getFileExtension = (file: File): string => {
        const validExtensions = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
        return validExtensions ? validExtensions[0] : '';
    };

    const uploadPost = async (title: string, content: string, images: UploadImage[]) => {
        try {
            if (!title.trim()) {
                throw new Error('제목을 입력해주세요.');
            }

            if (!content.trim()) {
                throw new Error('내용을 입력해주세요.');
            }

            if (images.length > 0 && !validateImages(images)) {
                throw new Error('지원하지 않는 이미지 형식이 포함되어 있습니다. (지원 형식: JPG, PNG, GIF, WEBP)');
            }

            setIsLoading(true);
            const formData = new FormData();

            // Add request data
            const requestData: CreatePostRequest = {
                title: title.trim(),
                content: content.trim(),
                files: images.map((image, index) => ({
                    originalFileName: `image_${index + 1}.${getFileExtension(image.file)}`,
                    displayOrder: index
                }))
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            // Add files
            images.forEach((image, index) => {
                const extension = getFileExtension(image.file);
                formData.append('files', image.file, `image_${index + 1}.${extension}`);
            });

            await multipartApi.post('/posts/general', formData);
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