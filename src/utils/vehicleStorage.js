// AutoGenesis — Demo Vehicle Storage (localStorage-based)
// Replace this file's internals with real API calls when backend is ready.

const VEHICLES_KEY = 'ag_custom_vehicles';
const IMAGE_PREFIX = 'ag_img_';

/**
 * Returns all custom vehicles saved to localStorage.
 */
export function getCustomVehicles() {
    try {
        const raw = localStorage.getItem(VEHICLES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * Saves a new vehicle to localStorage.
 * The vehicle object should be fully formed (all fields).
 */
export function saveCustomVehicle(vehicle) {
    const existing = getCustomVehicles();
    existing.push(vehicle);
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(existing));
}

/**
 * Generates the next vehicle ID (e.g. "AG-006", "AG-007").
 */
export function generateVehicleId() {
    // Static vehicles are AG-001 to AG-005
    const STATIC_COUNT = 5;
    const custom = getCustomVehicles();
    const maxCustom = custom.reduce((max, v) => {
        const num = parseInt(v.id.replace('AG-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, STATIC_COUNT);
    return `AG-${String(maxCustom + 1).padStart(3, '0')}`;
}

/**
 * Saves a vehicle image as a base64 data URL.
 */
export function saveVehicleImage(id, dataUrl) {
    try {
        localStorage.setItem(`${IMAGE_PREFIX}${id}`, dataUrl);
    } catch (e) {
        console.warn('Image too large for localStorage, skipping:', e);
    }
}

/**
 * Retrieves a vehicle image by ID.
 * Returns the data URL or null if not found.
 */
export function getVehicleImage(id) {
    return localStorage.getItem(`${IMAGE_PREFIX}${id}`) || null;
}

/**
 * Gets a custom vehicle by its ID.
 */
export function getCustomVehicleById(id) {
    return getCustomVehicles().find(v => v.id === id) || null;
}
