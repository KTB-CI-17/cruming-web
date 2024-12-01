import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProblemForm } from "../../components/community/new/ProblemForm.tsx";

export default function NewProblemPage() {
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [level, setLevel] = useState('');
    const [image, setImage] = useState<{ file: File; preview: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const problemImage = location.state?.problemImage;
        if (problemImage) {
            console.log('Received problem image:', problemImage);
            setImage(problemImage);
        }
    }, [location.state]);

    const handleSubmit = () => {
        console.log("upload API 연결");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1">
                <ProblemForm
                    title={title}
                    content={content}
                    level={level}
                    image={image}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    onLevelChange={setLevel}
                    isLoading={isLoading}
                />
            </div>

            <div className="p-4 border-t">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !title || !content || !level || !image}
                    className="w-full bg-primary text-white px-0 py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    완료
                </button>
            </div>
        </div>
    );
}
