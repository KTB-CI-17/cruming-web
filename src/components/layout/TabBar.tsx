import { memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NAVIGATION_TABS } from '../../constants/navigation';
import { LAYOUT, Z_INDEX } from '../../constants/layout';
import { COLORS, FONT } from '../../styles/theme';

export const TabBar = memo(() => {
    const location = useLocation();

    return (
        <nav
            className="w-full bg-white border-t"
            style={{
                height: LAYOUT.TAB_BAR_HEIGHT,
                borderColor: COLORS.GRAY[200],
                zIndex: Z_INDEX.TAB_BAR
            }}
        >
            <div className="flex items-center justify-between h-full px-2">
                {NAVIGATION_TABS.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className="flex flex-col items-center justify-center flex-1 pt-1"
                        >
                            <img
                                src={tab.icon}
                                alt={tab.title}
                                className="w-5 h-5 mb-1"
                                style={{
                                    filter: isActive
                                        ? 'invert(46%) sepia(98%) saturate(1925%) hue-rotate(228deg) brightness(95%) contrast(91%)'
                                        : 'invert(72%) sepia(5%) saturate(505%) hue-rotate(179deg) brightness(91%) contrast(86%)'
                                }}
                            />
                            <span
                                className="text-xs"
                                style={{
                                    fontSize: FONT.SIZES.xs,
                                    color: isActive ? COLORS.PRIMARY : COLORS.GRAY[500]
                                }}
                            >
                                {tab.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
});

TabBar.displayName = 'TabBar';