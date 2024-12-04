// @ts-ignore

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, BellIcon } from '@radix-ui/react-icons';
import { HeaderProps } from '../../types/layout';
import { COLORS, FONT } from '../../styles/theme';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {LAYOUT, PADDING, Z_INDEX} from "../../constants/layout";

export const Header = memo(({
                                onBack,
                                onNotification,
                                showBackButton = true,
                                showNotification = true,
                                title = 'Cruming'
                            }: HeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleNotification = () => {
        if (onNotification) {
            onNotification();
        } else {
            alert("준비 중인 서비스입니다.");
        }
    };

    return (
        <header
            className="w-full bg-white shadow-md"
            style={{
                height: LAYOUT.HEADER_HEIGHT,
                zIndex: Z_INDEX.HEADER
            }}
        >
            <div
                className="flex items-center justify-between h-full"
                style={{padding: PADDING.HEADER}}
            >
                {showBackButton && (
                    <button
                        onClick={handleBack}
                        className="p-1 rounded-full transition-colors hover:bg-gray-100"
                        aria-label="뒤로가기"
                    >
                        <ChevronLeftIcon className="w-6 h-6" style={{color: COLORS.GRAY[500]}}/>
                    </button>
                )}

                <h1
                    className="text-center font-bold"
                    style={{
                        fontSize: FONT.SIZES['2xl'],
                        lineHeight: '34px',
                        letterSpacing: '4px',
                        color: COLORS.PRIMARY
                    }}
                >
                    {title}
                </h1>

                {showNotification && (
                    <button
                        onClick={handleNotification}
                        className="p-1 rounded-full transition-colors hover:bg-gray-100"
                        aria-label="알림"
                    >
                        <BellIcon className="w-6 h-6" style={{color: COLORS.GRAY[500]}}/>
                    </button>
                )}
            </div>
        </header>
    );
});

Header.displayName = 'Header';