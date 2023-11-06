<script lang="ts">
    import { onMount } from "svelte";
    
    let username = "Unknown";

    onMount(() => {
        const account = sessionStorage.getItem("msal.account");
        if (!account) {
            window.location.href = "/";
        } else {
            username = JSON.parse(account).name ;
        }
    });
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Hallo {username}</h3>
	</div>
</div>

