<svelte:head>
	<title>Home</title>
</svelte:head>

<script lang="ts">
    import { authStore, userStore } from "$lib/authStore";

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { get } from "svelte/store";
    
    async function resetUserStore() {
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

    async function handleChange(e: any) {
        e.preventDefault();
        const value = e.target.value;
        const key = e.target.name;
        userStore.set({ ...get(userStore), [key]: value });
    }

    async function handleFileUpload(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result?.toString();
            const searchentries = Object.keys(get(userStore));
            if (!searchentries.every(entry => result?.includes(entry))) {
                alert('Die Datei ist ungültig!');
                return;
            }
            const rows = result?.split('\n');
            rows?.map(row => row.split(',')).forEach(([key, value]) => {
                userStore.set({ ...get(userStore), [key]: value });
            });
        }
        reader.readAsText(file);
    }

    async function handleDownload() {
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
</script>

<section class="space-y-10 w-full">
    <div class="space-y-1">
        <h3 class="text-2xl font-semibold tracking-tight">Hallo {$authStore.name}!</h3>
        <p class="text-sm text-muted-foreground mb-10">Willkommen auf der Startseite des IT-Portals.</p>
    </div>

    <div class="space-y-2">
        <Label for="data">Meine Daten per CSV importieren</Label>
        <Input id="data" type="file" accept=".csv," on:change={handleFileUpload}/>
        <p class="text-sm text-muted-foreground">INFO: Es werden nur .csv Files unterstützt, die mit dieser Website generiert wurden</p>
    </div>

    <div>
        <h4 class="text-lg font-semibold tracking-tight mb-0.5">
            Meine persönlichen Daten
        </h4>
        <p class="text-sm text-muted-foreground mb-5">Erfasse deine Daten, um diese anschliessend auf der gesamten Website verwenden zu können. Es werden <strong>keine Daten</strong> in einer Datenbank gespeichert, alles befindet sich nur auf deinem Computer.</p>
        <form class="flex flex-col w-full space-y-5" on:change={handleChange}>
            {#each Object.entries($userStore) as [key, value]}
                {#if !value}
                    <div class="sm:flex">
                        <Label class="text-sm pt-2 sm:w-1/3" for="{key}">{key}</Label>
                        <Input type="text" id="{key}" name="{key}" placeholder="{key}" bind:value={value} class="border-blue-300"/>
                    </div>
                {:else}
                    {#if key == "Email"}
                        <div class="sm:flex">
                            <Label class="text-sm pt-2 sm:w-1/3" for="{key}">{key}</Label>
                            <Input type="text" id="{key}" name="{key}" placeholder="{key}" bind:value={value} disabled/>
                        </div>
                    {:else}
                        <div class="sm:flex">
                            <Label class="text-sm pt-2 sm:w-1/3" for="{key}">{key}</Label>
                            <Input type="text" id="{key}" name="{key}" placeholder="{key}" bind:value={value}/>
                        </div>
                    {/if}
                {/if}
             {/each}
            <input type="text" id="accessKey" name="accessKey" class="hidden" bind:value={$authStore.accessToken}>
        </form>
        <div class="sm:flex gap-5">
            <Button on:click={handleDownload} variant="secondary" class="w-full mt-4">.csv herunterladen</Button>
            <Button on:click={resetUserStore} variant="destructive" class="w-full mt-4">Alle Daten zurücksetzen</Button>
        </div>
    </div>
</section>