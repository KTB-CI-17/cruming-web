import { memo } from 'react';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { LayoutProps } from '../../types/layout';
import { LAYOUT, PADDING } from '../../constants/layout';
import { COLORS } from '../../styles/theme';

export const Layout = memo(({ children }: LayoutProps) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ backgroundColor: COLORS.GRAY[100] }}
        >
            <div
                className="relative bg-white w-full"
                style={{
                    maxWidth: LAYOUT.MAX_CONTENT_WIDTH,
                    maxHeight: LAYOUT.MAX_CONTENT_HEIGHT,
                    height: '100%',
                }}
            >
                <div className="flex flex-col h-full">
                    <Header />

                    <main
                        className="flex-1 overflow-y-auto"
                        style={{
                            paddingLeft: PADDING.MAIN.HORIZONTAL,
                            paddingRight: PADDING.MAIN.HORIZONTAL,
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <style>
                            {`
                                main::-webkit-scrollbar {
                                    display: none;
                                }
                            `}
                        </style>
                        {children}
                    </main>

                    <TabBar />
                </div>
            </div>

            <div
                className="fixed inset-0 -z-10"
                style={{ backgroundColor: COLORS.GRAY[100] }}
            />
        </div>
    );
});

Layout.displayName = 'Layout';