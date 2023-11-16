<svelte:head>
	<title>Home</title>
</svelte:head>

<script lang="ts">
    import { authStore, userStore } from "$lib/authStore";
	import { page } from '$app/stores';

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { get } from "svelte/store";
    
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

    async function upload() {
        // TODO: Upload
        // https://www.okupter.com/blog/sveltekit-file-upload
    }

    async function download() {
        const filename = get(authStore).name + '.csv';

        const data = get(userStore);
        const csv = Object.keys(data).map(key => `${key},${data[key]}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if ($page.form) {
        updateUserStore();
    }

    let input = "";

    $: console.log(input)
    console.log($page.form);
    console.log($userStore);

    // TODO: OneDrive Link
</script>

<section class="space-y-10 w-full">
    <div class="space-y-1">
        <h3 class="text-2xl font-semibold tracking-tight">Hallo {$authStore.name}!</h3>
        <p class="text-sm text-muted-foreground mb-10">Willkommen auf der Startseite des IT-Portals.</p>
    </div>


    <div class="items-center gap-3 space-y-2">
        <Label for="data">CSV</Label>
        <Input id="data" type="file" accept=".csv," bind:value={input}/>
        {#if input != ""}
            <Button on:click={upload} class="w-full mt-2">Hochladen</Button>
        {:else}
            <Button disabled class="w-full mt-2">Hochladen</Button>
        {/if}
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
            <Button variant="outline">Persönliche Informationen updaten</Button>
        </form>
        <Button on:click={download} class="w-full mt-4">Persönliche Informationen herunterladen</Button>
    </div>
</section>