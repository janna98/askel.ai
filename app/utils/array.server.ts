export function getUniques<T>(items: T[], key: keyof T): T[] {
    const map: Record<string, T> = {};

    for (const item of items) {
        const keyValue = item[key] as string;
        if (map[keyValue]) continue;

        map[keyValue] = item;
    }

    return [...Object.values(map)];
}