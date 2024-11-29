import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');

    return (
        <div className="px-5 py-0">
            <div className={`
                flex items-center h-10 px-4 
                border rounded-full bg-white
                ${isFocused ? 'border-[#826CF6]' : 'border-[#8F9BB3]'}
            `}>
                <input
                    type="text"
                    className="flex-1 text-sm text-black outline-none"
                    placeholder="검색어를 입력해 주세요."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <button className="p-1">
                    <Search
                        size={20}
                        className={isFocused ? 'text-[#826CF6]' : 'text-[#8F9BB3]'}
                    />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;