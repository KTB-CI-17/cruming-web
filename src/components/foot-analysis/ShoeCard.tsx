import {ShoeCardProps} from "../../types/foot-analysis";

export function ShoeCard({ modelName, size, productUrl, imageUrl }: ShoeCardProps) {
    return (
        <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 mb-3 bg-white rounded-xl border border-[#E4E9F2] shadow-sm"
        >
            <img
                src={imageUrl}
                alt={modelName.ko}
                className="w-[100px] h-[100px] object-contain rounded-lg bg-[#F8F9FC]"
            />
            <div className="flex-1 flex flex-col justify-center">
                <div className="mb-2">
                    <p className="text-sm text-[#1A1F36] mb-1">{modelName.ko}</p>
                    <p className="text-sm text-[#1A1F36] font-semibold">{modelName.en}</p>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-[#1A1F36] font-medium">추천 사이즈 :</span>
                    <span className="text-[#1A1F36]">{size}</span>
                </div>
            </div>
        </a>
    );
}