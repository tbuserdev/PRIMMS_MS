import { PublicClientApplication } from "@azure/msal-browser";
import { authStore } from "$lib/authStore";
import { get } from "svelte/store";

const config = {
    auth: {
        clientId: 'e0e48643-a2d9-49cd-a8c5-d3b4e945dcfb',
        authority: 'https://login.microsoftonline.com/d2ed94a9-779e-454b-9532-ff9783a65463',
        redirectUri: '/',
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: '',
        storeAuthStateInCookie: false
    }
};

export async function login() {
    const msalInstance = await PublicClientApplication.createPublicClientApplication(config);
    const loginRequest = {
        scopes: ['user.read', 'calendars.readwrite']
    };
    await msalInstance.loginPopup(loginRequest).then(loginResponse => {
        if (loginResponse.account === null) {
            return;
        } else {
            authStore.set({
                auth: true,
                email: loginResponse.account.username,
                name: loginResponse.account.name,
                homeAccId: loginResponse.account.homeAccountId,
                accessToken: loginResponse.accessToken,
        });
        }
    })
}

export async function logout() {
    const msalInstance = await PublicClientApplication.createPublicClientApplication(config);
    const logoutRequest = {
        account: msalInstance.getAccountByHomeId(get(authStore).homeAccId)
    };
    await msalInstance.logoutPopup(logoutRequest).then(() => {
        authStore.set({
            auth: false,
            email: "",
            name: "",
            homeAccId: "",
            accessToken: "",
        });
    })
}