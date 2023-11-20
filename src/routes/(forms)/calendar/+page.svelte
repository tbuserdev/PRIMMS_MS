<svelte:head>
	<title>Kalender</title>
</svelte:head>

<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";

	import BirthdayForm from "$lib/components/BirthdayForm.svelte";
	import { authStore } from "$lib/authStore";
	
	export let data;

	// TODO: Error message from server and sucess form submit
	// TODO: Easier CSV Upload - copy from startpage
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Kalender Update</h3>
		<p class="text-sm text-muted-foreground">Hier kannst du automatisch deinen Kalender updaten</p>
	</div>
	<BirthdayForm form={data.form} accessToken={$authStore.accessToken} />
</div>
