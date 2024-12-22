import errorImg from '@/assets/icon/error.png';

export default function ErrorPage() {
    return (
        <div className="w-full max-w-md space-y-8 p-8">
            <div className="flex justify-center">
                <div className="w-64 h-64 mb-4">
                    <img
                        src={errorImg}
                        alt="로고"
                        className="w-full h-full object-contain"
                    />
                    <h6 className="text-m text-[#6B4EFF] text-center font-medium leading-9">
                        존재하지 않는 페이지 입니다.
                    </h6>
                </div>
            </div>

        </div>
    )
};