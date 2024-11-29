import { ReactNode } from 'react';

export interface LayoutProps {
    children: ReactNode;
}

export interface TabItem {
    path: string;
    title: string;
    icon: string;
}

export interface HeaderProps {
    onBack?: () => void;
    onNotification?: () => void;
    showBackButton?: boolean;
    showNotification?: boolean;
    title?: string;
}