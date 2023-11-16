<svelte:head>
	<title>Home</title>
</svelte:head>

<script lang="ts">
    import { authStore, userStore } from "$lib/authStore";
	import { page } from '$app/stores';

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    
    async function updateUserStore(){
        if ($page.form) {
            userStore.set({
                Vorname: $page.form.body.vorname || "",
                Nachname: $page.form.body.nachname || "",
                Email: $authStore.email || "",
                Personalnummer: $page.form.body.personalnummer || "",
                Schulhaus: $page.form.body.schulhaus || "",
                Klasse: $page.form.body.klasse || "",
                Schultyp: $page.form.body.schultyp || ""
            });
        } else {
            userStore.set({
                Vorname: "",
                Nachname: "",
                Email: $authStore.email,
                Personalnummer: "",
                Schulhaus: "",
                Klasse: "",
                Schultyp: ""
            });
        }
    }

    if ($page.form) {
        updateUserStore();
    }

    console.log($page.form);
    console.log($userStore);

    // TODO: Implement download of csv file
    // TODO: OneDrive Connection
</script>

<section class="space-y-10">
    <div class="space-y-1">
        <h3 class="text-2xl font-semibold tracking-tight">Hallo {$authStore.name}!</h3>
        <p class="text-sm text-muted-foreground mb-10">Willkommen auf der Startseite des IT-Portals.</p>
    </div>

    <div>
        <h4 class="text-lg font-semibold tracking-tight mb-4">
            Persönliche Informationen
        </h4>
        <form class="flex flex-col w-full space-y-5" method="POST">
            {#each Object.entries($userStore) as [key, value]}
                {#if !value}
                    <div class="sm:flex">
                        <Label class="text-sm pt-2 sm:w-1/3" for="{key}">{key}</Label>
                        <Input type="text" id="{key}" name="{key}" placeholder="{key}" bind:value={value} class="border-blue-300"/>
                    </div>
                {:else}
                    <div class="sm:flex">
                        <Label class="text-sm pt-2 sm:w-1/3" for="{key}">{key}</Label>
                        <Input type="text" id="{key}" name="{key}" placeholder="{key}" bind:value={value}/>
                    </div>
                {/if}
             {/each}
            <input type="text" id="accessKey" name="accessKey" class="hidden" bind:value={$authStore.accessToken}>
            <Button>Persönliche Informationen updaten</Button>
        </form>
    </div>
</section>