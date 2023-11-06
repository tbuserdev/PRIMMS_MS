import { CLIENT_ID, TENANT_ID } from "$env/static/private";
import { PublicClientApplication } from "@azure/msal-browser";

export const microsoftSettings = {
    "clientId": CLIENT_ID,
    "tenantId": TENANT_ID,
    "graphUserScopes": [
        "User.Read", 
        "User.ReadBasic.All"
    ]
};

const microsoftFrontEndLogin = {
    auth: {
        clientId: CLIENT_ID,
        authority: `https://login.microsoftonline.com/${TENANT_ID}`
      }
};

export const clientApp = new PublicClientApplication(microsoftFrontEndLogin)