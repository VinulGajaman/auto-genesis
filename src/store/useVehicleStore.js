import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { VEHICLES } from '../data/vehicles';
import { getCustomVehicles, getVehicleImage } from '../utils/vehicleStorage';

/**
 * Vehicle Store — merged static + custom vehicles
 * Provides: vehicles[], getVehicleById(), refreshCustomVehicles()
 */
export const useVehicleStore = create(
    immer((set, get) => ({
        vehicles: buildVehicleList(),

        getVehicleById: (id) => {
            return get().vehicles.find((v) => v.id === id) || null;
        },

        refreshCustomVehicles: () => {
            set((state) => {
                state.vehicles = buildVehicleList();
            });
        },
    }))
);

function buildVehicleList() {
    const custom = getCustomVehicles().map((v) => {
        const imgData = getVehicleImage(v.id);
        return { ...v, image: imgData || v.image || '' };
    });
    return [...VEHICLES, ...custom];
}
