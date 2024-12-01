import { Loader2 } from 'lucide-react';

export default function HoldAnalysisLoading() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-112px)] bg-white">
            <h2 className="text-2xl font-semibold text-[#1A1F36] mb-2">분석중</h2>
            <p className="text-base text-[#8F9BB3] mb-10">잠시만 기다려 주세요.</p>
            <Loader2
                className="w-10 h-10 text-[#735BF2] animate-spin"
            />
        </div>
    );
}