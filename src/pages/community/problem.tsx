import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProblemForm } from "../../components/community/new/ProblemForm";
import { LocationData } from '../../types/location';
import {useUploadProblem} from "../../hooks/useProblemPostUpload.ts";

export default function NewProblemPage() {
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [level, setLevel] = useState('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [image, setImage] = useState<{ file: File; preview: string; } | null>(null);

    const { uploadProblem, isLoading } = useUploadProblem({
        onError: (error) => {
            alert(error);
        }
    });

    useEffect(() => {
        const problemImage = location.state?.problemImage;
        if (problemImage) {
            console.log('Received problem image:', problemImage);
            setImage(problemImage);
        }
    }, [location.state]);

    const handleSubmit = async () => {
        if (!locationData) {
            alert('위치를 선택해주세요.');
            return;
        }

        if (!image) {
            alert('문제 이미지를 업로드해주세요.');
            return;
        }

        await uploadProblem(title, content, level, locationData, image);
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