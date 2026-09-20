export const parseGroupMembers = (raw: any): string[] => {
    if (!raw) return [];

    try {
        let parsed = raw;

        while (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
        }

        return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
        // Some endpoints (Team Alerts) return members as a plain
        // comma-separated string instead of JSON.
        if (typeof raw === "string") {
            return raw
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean);
        }

        return [];
    }
};
