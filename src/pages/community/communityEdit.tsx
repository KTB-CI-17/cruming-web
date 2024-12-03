import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GeneralForm } from '../../components/community/new/GeneralForm';
import { ProblemForm } from '../../components/community/new/ProblemForm';
import { LocationData } from '../../types/location';
import { PADDING } from '../../../constants/layout';
import {Post, UploadImage} from "../../types/community.ts";
import {api} from "../../config/axios.ts";

export default function CommunityEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post | null>(null);

    // General Form States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<UploadImage[]>([]);

    // Problem Form States
    const [level, setLevel] = useState('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [image, setImage] = useState<{ file: File; preview: string } | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/posts/edit/${id}`);
                const postData = response.data;
                setPost(postData);

                // 공통 데이터 초기화
                setTitle(postData.title);
                setContent(postData.content);

                // 카테고리별 데이터 초기화
                if (postData.category === 'GENERAL') {
                    if (postData.files) {
                        const uploadImages: UploadImage[] = postData.files.map(file => ({
                            file: new File([], file.fileName),
                            preview: file.fileKey
                        }));
                        setImages(uploadImages);
                    }
                } else {
                    if (postData.files && postData.files.length > 0) {
                        const problemImage = postData.files[0];
                        setImage({
                            file: new File([], problemImage.fileName),
                            preview: problemImage.fileKey
                        });
                    }
                    if (postData.level) setLevel(postData.level);
                    if (postData.location) {
                        setLocationData({
                            placeName: postData.location,
                            // 다른 위치 데이터 필드는 서버 응답에 따라 추가
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                alert('게시글을 불러오는데 실패했습니다.');
                navigate('/community');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, navigate]);

    const handleSubmit = async () => {
        if (post?.category === 'PROBLEM') {
            if (!locationData) {
                alert('위치를 선택해주세요.');
                return;
            }

            if (!image) {
                alert('문제 이미지를 업로드해주세요.');
                return;
            }
        }

        try {
            setIsLoading(true);
            const formData = {
                id: Number(id),
                category: post?.category,
                title,
                content,
                ...(post?.category === 'PROBLEM' && {
                    location: locationData?.placeName,
                    level,
                }),
                files: post?.category === 'GENERAL'
                    ? images.map((img, index) => ({
                        originalFileName: img.file.name,
                        displayOrder: index
                    }))
                    : image
                        ? [{
                            originalFileName: image.file.name,
                            displayOrder: 0
                        }]
                        : []
            };

            await api.put(`/posts/${id}`, formData);
            navigate(`/community/${id}`);
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('게시글 수정에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !post) {
        return <div className="min-h-screen bg-white" />;
    }

    if (post.category === 'GENERAL') {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className="flex-1" style={{ paddingTop: PADDING.MAIN.TOP }}>
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