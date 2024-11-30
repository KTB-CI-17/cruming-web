import { useState } from 'react';
import { PostFormContent } from '../components/community/new/PostFormContent';
import { useUploadPost } from '../hooks/useUploadPost';
import { UploadImage } from '../types/community';
import { PADDING } from '../../constants/layout.ts';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<UploadImage[]>([]);

    const { uploadPost, isLoading } = useUploadPost({
        onError: (error) => {
            alert(error);
        }
    });

    const handleSubmit = () => {
        uploadPost(title, content, images);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1" style={{ paddingTop: PADDING.MAIN.TOP }}>
                <PostFormContent
                    title={title}
                    content={content}
                    images={images}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    onImagesChange={setImages}
                    isLoading={isLoading}
                />
            </div>

            <div className="py-2">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-primary text-white px-0 py-4 rounded-xl font-semibold text-base"
                >
                    완료
                </button>
            </div>
        </div>
    );
}