import { useState } from 'react';
import { GeneralForm } from '../../components/community/new/GeneralForm';
import {usePostUpload} from '../../hooks/usePostUpload.ts';
import { UploadImage } from '../../types/community';

export default function NewGeneralPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<UploadImage[]>([]);

    const { uploadPost, isLoading } = usePostUpload({
        onError: (error) => {
            alert(error);
        }
    });

    const handleSubmit = () => {
        uploadPost('GENERAL', title, content, images);
    };
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 pt-6">
                <GeneralForm
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