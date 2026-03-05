import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null, // { username, role, name }

            login: (username, password) => {
                // Hardcoded demo credentials
                if (username.toLowerCase() === 'admin' && password === 'admin123') {
                    set({
                        user: {
                            username: 'admin',
                            role: 'superadmin',
                            name: 'System Admin'
                        }
                    });
                    return true;
                }
                return false;
            },

            logout: () => set({ user: null })
        }),
        {
            name: 'ag_auth_session', // Keys saved to localStorage
        }
    )
);
