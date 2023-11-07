<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import BirthdayForm from "$lib/components/BirthdayForm.svelte";
	import { authStore } from "$lib/authStore";
	
	export let data;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Kalender Update</h3>
		<p class="text-sm text-muted-foreground">Hier kannst du automatisch deinen Kalender updaten</p>
	</div>
	<Separator />
	<BirthdayForm form={data.form} accessToken={$authStore.accessToken} />
</div>