import { writable } from "svelte/store";
import { browser } from '$app/environment'

// Local storage store utility
export const localStore = (key: string, initial: any) => {
    const toString = (value: any) => JSON.stringify(value, null, 2);
    const toObj = (value:any) => JSON.parse(value);

    if (browser && localStorage.getItem(key) === null) {
        localStorage.setItem(key, toString(initial));
    }

    const saved = toObj(browser && localStorage.getItem(key));

    const { subscribe, set, update } = writable(saved);

    return {
        subscribe,
        set: (value:any) => {
            localStorage.setItem(key, toString(value));
            return set(value);
        },
        update,
    };
};

// Auth store
export const authStoreObj = writable({
    auth: false,
    email: "",
    name: "",
    homeAccId: "",
    accessToken: "",
    expiresOn: "",
});

export const authStore = localStore("auth", authStoreObj);

// User store
export const userStoreObj = writable({
    Vorname: "",
    Nachname: "",
    Email: "",
    Personalnummer: "",
    Schulhaus: "",
    Klasse: "",
    Schultyp: "",
});

export const userStore = localStore("user", userStoreObj);
