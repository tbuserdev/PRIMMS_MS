import { PublicClientApplication } from "@azure/msal-browser";
import { authStore, userStore } from "$lib/authStore";

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: 'e0e48643-a2d9-49cd-a8c5-d3b4e945dcfb',
        authority: 'https://login.microsoftonline.com/d2ed94a9-779e-454b-9532-ff9783a65463'
    }
});

export async function login() {
    await msalInstance.initialize();
    await msalInstance.loginPopup({
        scopes: ['user.read', 'calendars.readwrite', 'contacts.readwrite']
    }).then((response) => {
        if (response.account === null) {
            return;
        }
    
        authStore.set({
            auth: true,
            email: response.account.username,
            name: response.account.name,
            homeAccId: response.account.homeAccountId,
            accessToken: response.accessToken,
            expiresOn: response.expiresOn,
        });

        userStore.set({
            Vorname: "",
            Nachname: "",
            Email: response.account.username,
            Personalnummer: "",
            Schulhaus: "",
            Klasse: "",
            Schultyp: "",
        });

    }).catch((error) => {
        console.log(error);
    });
}
   

export async function logout() {
    await msalInstance.initialize();
    await msalInstance.logoutPopup({
        account: msalInstance.getActiveAccount()
    }).then(() => {
        authStore.set({
            auth: false,
            email: "",
            name: "",
            homeAccId: "",
            accessToken: "",
            expiresOn: "",
        });

        userStore.set({
            Vorname: "",
            Nachname: "",
            Email: "",
            Personalnummer: "",
            Schulhaus: "",
            Klasse: "",
            Schultyp: "",
        });
    });
}