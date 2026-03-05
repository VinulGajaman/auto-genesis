/**
 * Formatting utilities — number, currency, date helpers
 */

export function formatLKR(value) {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatKm(value) {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('en').format(value) + ' km';
}

export function formatYear(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).getFullYear();
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(dateStr));
}

export function calcAge(year) {
    return new Date().getFullYear() - Number(year);
}
