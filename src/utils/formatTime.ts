export function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;

    if (diff < minute) {
        return '방금 전';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}분 전`;
    } else if (diff < hour * 23) {
        const hours = Math.floor(diff / hour);
        return `${hours}시간 전`;
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
}