<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import BirthdayForm from "$lib/components/BirthdayForm.svelte";
    import { onMount } from "svelte";
	
	export let data;
	let accessToken: string;

	onMount(() => {
		accessToken = sessionStorage.getItem("msal.token") as string || "";
		if (!accessToken) {
			window.location.href = "/";
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Kalender Update</h3>
		<p class="text-sm text-muted-foreground">Hier kannst du automatisch deinen Kalender updaten</p>
	</div>
	<Separator />
	<BirthdayForm form={data.form} accessToken={accessToken} />
</div>