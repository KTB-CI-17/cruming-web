import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GeneralForm } from '../../components/community/new/GeneralForm';
import { ProblemForm } from '../../components/community/new/ProblemForm';
import { LocationData } from '../../types/location';
import { PADDING } from '../../constants/layout';
import { Post, UploadImage, PostFile } from "../../types/community";
import { api } from "../../config/axios";

export default function CommunityEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<UploadImage[]>([]);
    const [level, setLevel] = useState('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [image, setImage] = useState<UploadImage | null>(null);
    const [deleteFileIds, setDeleteFileIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/posts/edit/${id}`);
                const postData = response.data;
                setPost(postData);

                // 기본 데이터 초기화
                setTitle(postData.title);
                setContent(postData.content);

                // 기존 파일 데이터 초기화
                if (postData.files) {
                    if (postData.category === 'GENERAL') {
                        const uploadImages: UploadImage[] = postData.files.map((file: PostFile) => ({
                            file: new File([], file.fileName),
                            preview: file.url,  // fileKey 대신 url 사용
                            id: file.id,
                            isFixed: true
                        }));
                        setImages(uploadImages);
                    } else if (postData.files.length > 0) {
                        const problemImage = postData.files[0];
                        setImage({
                            file: new File([], problemImage.fileName),
                            preview: problemImage.url,  // fileKey 대신 url 사용
                            id: problemImage.id,
                            isFixed: true
                        });
                    }
                }

                // Problem 관련 데이터 초기화
                if (postData.level) setLevel(postData.level);
                if (postData.location) {
                    setLocationData({
                        placeName: postData.location.placeName,
                        address: postData.location.address,
                        longitude: postData.location.longitude,
                        latitude: postData.location.latitude
                    });
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

    const handleFileDelete = (fileId: number) => {
        if (post?.category === 'GENERAL') {
            setDeleteFileIds(prev => [...prev, fileId]);
            setImages(prev => prev.filter(img => img.id !== fileId));
        }
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        if (post?.category === 'PROBLEM') {
            if (!locationData || !level || !image) {
                alert('모든 필수 항목을 입력해주세요.');
                return;
            }
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            const newFiles = post?.category === 'GENERAL'
                ? images
                    .filter(img => !img.id)
                    .map((img, index) => ({
                        originalFileName: img.file.name,
                        displayOrder: index
                    }))
                : image && !image.id
                    ? [{
                        originalFileName: image.file.name,
                        displayOrder: 0
                    }]
                    : [];

            const requestData = {
                id: Number(id),
                category: post?.category,
                title,
                content,
                level: post?.category === 'PROBLEM' ? level : undefined,
                locationRequest: post?.category === 'PROBLEM' ? {
                    placeName: locationData?.placeName,
                    address: locationData?.address,
                    latitude: locationData?.latitude,
                    longitude: locationData?.longitude
                } : undefined,
                deleteFileIds: post?.category === 'GENERAL' ? deleteFileIds : null,
                newFiles: newFiles
            };

            formData.append('request', new Blob([JSON.stringify(requestData)], {
                type: 'application/json'
            }));

            if (post?.category === 'GENERAL') {
                images
                    .filter(img => !img.id)
                    .forEach(img => {
                        formData.append('files', img.file);
                    });
            } else if (image && !image.id) {
                formData.append('files', image.file);
            }

            await api.post(`/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

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

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1" style={{ paddingTop: post.category === 'GENERAL' ? PADDING.MAIN.TOP : 0 }}>
                {post.category === 'GENERAL' ? (
                    <GeneralForm
                        title={title}
                        content={content}
                        images={images}
                        onTitleChange={setTitle}
                        onContentChange={setContent}
                        onImagesChange={setImages}
                        onFileDelete={handleFileDelete}
                        isLoading={isLoading}
                    />
                ) : (
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
                        onFileDelete={handleFileDelete}
                        onImageChange={setImage}
                        isLoading={isLoading}
                    />
                )}
            </div>

            <div className="p-4 border-t">
                <button
                    onClick={handleSubmit}
                    disabled={
                        isLoading ||
                        !title ||
                        !content ||
                        (post.category === 'PROBLEM' && (!level || !locationData || !image))
                    }
                    className="w-full bg-primary text-white px-0 py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    완료
                </button>
            </div>
        </div>
    );
}