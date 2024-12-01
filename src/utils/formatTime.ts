// utils/formatTime.ts
export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diff < minute) {
        return '방금 전';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}분 전`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours}시간 전`;
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days}일 전`;
    } else if (diff < month) {
        const weeks = Math.floor(diff / week);
        return `${weeks}주 전`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months}개월 전`;
    } else {
        const years = Math.floor(diff / year);
        return `${years}년 전`;
    }
}