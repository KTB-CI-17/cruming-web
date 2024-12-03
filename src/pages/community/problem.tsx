import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProblemForm } from "../../components/community/new/ProblemForm";
import { LocationData } from '../../types/location';
import { UploadImage } from "../../types/community.ts";
import { usePostUpload } from "../../hooks/usePostUpload.ts";

export default function NewProblemPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [level, setLevel] = useState('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    const location = useLocation();

    const [image, setImage] = useState<UploadImage | null>(() => {
        if (location.state?.problemImage) {
            return {
                file: location.state.problemImage.file,
                preview: location.state.problemImage.preview,
                isFixed: location.state.problemImage.isFixed
            };
        }
        return null;
    });

    const { uploadPost, isLoading } = usePostUpload({
        onError: (error) => {
            alert(error);
        }
    });

    const handleSubmit = async () => {
        if (!locationData) {
            alert('위치를 선택해주세요.');
            return;
        }

        if (!image) {
            alert('문제 이미지를 업로드해주세요.');
            return;
        }

        uploadPost('PROBLEM', title, content, image, locationData, level);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1">
                <ProblemForm
                    title={title}
                    content={content}
                    level={level}
                    location={locationData}
                    image={image}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    onLevelChange={setLevel}
                    onLocationChange={setLocationData}
                    onImageChange={setImage}
                    isLoading={isLoading}
                />
            </div>

            <div className="p-4 border-t">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !title || !content || !level || !locationData || !image}
                    className="w-full bg-primary text-white px-0 py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    완료
                </button>
            </div>
        </div>
    );
}