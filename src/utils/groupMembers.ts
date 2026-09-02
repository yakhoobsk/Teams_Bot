export const parseGroupMembers = (raw: any): string[] => {
    if (!raw) return [];

    try {
        let parsed = raw;

        while (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
        }

        return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
        return [];
    }
};
