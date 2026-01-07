export function generateRandomDate() {
    // Timestamps in milliseconds
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    // Create bounds
    const start = now - sevenDays;
    const end = now - oneMinute;

    // Generate a random timestamp between start and end
    const randomTimestamp = Math.floor(Math.random() * (end - start) + start);

    // Convert back to a Date object and return
    return new Date(randomTimestamp);
}

export function getRelativeTimeString(date) {
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
}