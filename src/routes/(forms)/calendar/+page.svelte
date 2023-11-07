<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import * as Accordion from "$lib/components/ui/accordion";

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
	<Accordion.Root>
		<Accordion.Item value="item-1">
		  <Accordion.Trigger>Wie funktionierts?</Accordion.Trigger>
		  <Accordion.Content>
			1. .csv File
		  </Accordion.Content>
		</Accordion.Item>
	  </Accordion.Root>
	<BirthdayForm form={data.form} accessToken={$authStore.accessToken} />
</div>