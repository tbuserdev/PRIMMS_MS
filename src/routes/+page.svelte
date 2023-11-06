<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
    import { onMount } from "svelte";
    import logo from "$lib/assets/logo.png";

    let loggedIn = false;
    let accountobj: AccountInfo;

    const config = {
        auth: {
            clientId: 'e0e48643-a2d9-49cd-a8c5-d3b4e945dcfb',
            authority: 'https://login.microsoftonline.com/d2ed94a9-779e-454b-9532-ff9783a65463',
            redirectUri: '/',
            postLogoutRedirectUri: '/'
        }
    };

    async function login() {
        const msalInstance = await PublicClientApplication.createPublicClientApplication(config);
        const loginRequest = {
            scopes: ['user.read', 'calendars.readwrite']
        };
        await msalInstance.loginPopup(loginRequest).then(loginResponse => {
            const account = loginResponse.account;
            const accessToken = loginResponse.accessToken;
            sessionStorage.setItem("msal.account", JSON.stringify(account));
            sessionStorage.setItem("msal.token", accessToken);
            loggedIn = true;
            accountobj = account;
        })
    }

    async function logout() {
        const msalInstance = await PublicClientApplication.createPublicClientApplication(config);
        const accountID = accountobj.homeAccountId;
        const logoutRequest = {
            account: msalInstance.getAccountByHomeId(accountID)
        };
        sessionStorage.removeItem("msal.account");
        sessionStorage.removeItem("msal.token");
        await msalInstance.logoutPopup(logoutRequest).then(logoutResponse => {
            loggedIn = false;
        })
    }

    onMount (() => {
        if (accountobj === undefined) {
            let sessionaccount = sessionStorage.getItem("msal.account");
            if (sessionaccount) {
                accountobj = JSON.parse(sessionaccount);
                loggedIn = true;
            } else {
                accountobj = {} as AccountInfo;
                loggedIn = false;
            }
        }
    })
</script>



<div class="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="absolute right-4 top-4 md:right-8 md:top-8">
        <DarkModeToggle/>
    </div>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div class="absolute inset-0 bg-cover" style="background-image:url(https://images.unsplash.com/photo-1501349800519-48093d60bde0?auto=format&fit=crop&q=80&w=4740&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);"/>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-4 text-center">
                {#if loggedIn}
                <div class="flex flex-row justify-center">
                    <img src={logo} alt="Logo Primarschule" class="w-[125px] mb-2">
                </div>
                <div class="space-y-2 mb-2">
                    <h1 class="text-2xl font-semibold tracking-tight">Hallo, {accountobj.name}</h1>
				    <p class="text-sm text-muted-foreground">Du hast dich erfolgreich angemeldet</p>
                </div>
                <Button href="/dashboard">zum Dashboard</Button>
                <Button on:click={logout} variant="destructive">Logout</Button>

                {:else}
                <div class="flex flex-row justify-center">
                    <img src={logo} alt="Logo Primarschule" class="w-[125px] mb-2">
                </div>
                <div class="space-y-2 mb-1">
                    <h1 class="text-2xl font-semibold tracking-tight">Du bist nicht eingeloggt</h1>
				    <p class="text-sm text-muted-foreground">Logge dich ein um diesen Service zu nutzen</p>
                </div>
                <Button on:click={login}>Login</Button>
                {/if}
			</div>
        
			<p class="px-8 text-center text-sm text-muted-foreground">By clicking continue, you agree to our{" "}<a href="/"class="underline underline-offset-4 hover:text-primary">
			Terms of Service</a>{" "}and{" "}<a href="/" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a></p>
		</div>
	</div>
</div>