<script>
    import { authStore } from "$lib/authStore";
    import { onMount } from "svelte";
    import { logout } from "$lib/msal";


    let timeLeftCount = 0;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let datum = new Date($authStore.expiresOn).toLocaleDateString();
    let uhrzeit = new Date($authStore.expiresOn).toLocaleTimeString();

    onMount(() => {
        const interval = setInterval(() => {
			const now = new Date();
			const expiresOn = new Date($authStore.expiresOn);
			const diff = expiresOn.getTime() - now.getTime();

            hour = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minute = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            second = Math.floor((diff % (1000 * 60)) / 1000);

			if (diff <= 0) {
				timeLeftCount = 0;
			}
            timeLeftCount = diff;
			}, 1000);
		
		return () => {
      		clearInterval(interval);
		};
    });
</script>

{#if timeLeftCount == 0}
    <button class="text-sm text-muted-foreground text-red-500 text-left" on:click={logout}>Zugang abgelaufen am {datum}, um {uhrzeit}. <br>Bitte hier klicken um den Zugang zu erneuern (ausloggen).</button>
{:else}
    {#if hour > 0}
        <p class="text-sm text-muted-foreground">Zugang aktiv für {hour} Stunden, {minute} Minuten</p>
    {:else if minute > 0}
        <p class="text-sm text-muted-foreground">Zugang aktiv für {minute} Minuten, {second} Sekunden</p>
    {:else}
        <p class="text-sm text-muted-foreground">Zugang aktiv für {second} Sekunden</p>
    {/if}
{/if}