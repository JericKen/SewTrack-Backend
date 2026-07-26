export function formatDateTime(value) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
    }).format(new Date(value));
}

export function getTodayISO() {
    return new Date().toISOString().slice(0, 10);
}

export function getMonthStartISO() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
}
