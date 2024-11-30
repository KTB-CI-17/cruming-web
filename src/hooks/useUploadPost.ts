import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import { CreatePostRequest, UploadImage } from '../types/community';

interface UseUploadPostProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const useUploadPost = ({ onSuccess, onError }: UseUploadPostProps = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const uploadPost = async (title: string, content: string, images: UploadImage[]) => {
        if (!title.trim()) {
            onError?.('제목을 입력하세요.');
            return;
        }

        if (!content.trim()) {
            onError?.('내용을 입력하세요.');
            return;
        }

        if (title.length > 100) {
            onError?.('제목은 최대 100자까지 입력 가능합니다.');
            return;
        }

        if (content.length > 1000) {
            onError?.('본문은 최대 1,000자까지 입력 가능합니다.');
            return;
        }

        if (images.length > 5) {
            onError?.('이미지는 최대 5개까지만 업로드할 수 있습니다.');
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();

            // Add post data
            const requestData: CreatePostRequest = {
                title: title.trim(),
                content: content.trim(),
                files: images.map((_, index) => ({
                    originalFileName: `image_${index + 1}.jpg`,
                    displayOrder: index
                }))
            };

            formData.append(
                'request',
                new Blob([JSON.stringify(requestData)], { type: 'application/json' })
            );

            images.forEach((image, index) => {
                formData.append('files', image.file);
            });

            await api.post('/posts/general', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onSuccess?.();
            navigate('/community');
        } catch (error: any) {
            console.error('Post submission error:', error);
            onError?.(error.response?.data?.message || '게시글 등록에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        uploadPost,
        isLoading
    };
};