<svelte:head>
	<title>E-Mail Liste</title>
</svelte:head>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import { Separator } from "$lib/components/ui/separator";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import * as Table from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";
  	import { Label } from "$lib/components/ui/label";
	import * as Alert from "$lib/components/ui/alert";

	import { authStore } from "$lib/authStore";

	let inputstring = "";
	let contacts: any[] = [];
	let contactjson = "";

	async function inputToObj() {
		let contactstring = inputstring.split(/\s{2,}/);
		
		contacts = contactstring.map((contact) => {
			let contactObj = {
				name: "",
				email: "",
			};
			
			let contactArray = contact.split(/,(?![^(]*\))/);
			let email = contactArray[2].replace(" ", "");
			if (email == "Fehlende E-Mail Adresse") {
				email = "";
			}

			let childrenname = contactArray[1].substring(contactArray[1].indexOf("(") + 1, contactArray[1].indexOf(")"));
			let parentname = contactArray[0];
			let name = childrenname + " (" + parentname + ")";

			contactObj["name"] = name;
			contactObj["email"] = email;

			return contactObj;
		});
		contactjson = JSON.stringify(contacts);
	}
</script>

<div class="space-y-6">
	<div class="space-y-3">
		<div>
			<h3 class="text-lg font-medium">Benutzerdefinierte Kontaktgruppen</h3>
			<p class="text-sm text-muted-foreground">Erstelle Kontaktgruppen mit der du von deinem gewohnten Postfach verschiedene Gruppen kontaktieren kannst - <a class="underline" href="https://scribehow.com/shared/Benutzerdefinierte_Kontaktgruppen_ITPRIMMS__OioZ-rw2RYKeGqCgVv7Bnw">hier zur Anleitung</a>.</p>
		</div>
		<Separator />
		{#if $page.form}
			<Alert.Root class="mt-4 border-green-500">
				<Alert.Title class="text-green-500">Kontakterstellung erfolgreich!</Alert.Title>
				<Alert.Description class="text-green-500">{$page.form.body.message}</Alert.Description>
			</Alert.Root>
		{/if}
	</div>

	{#if contacts.length > 0}
		<form class="flex flex-col w-full space-y-5"  method="POST" use:enhance>
			<Label for="contactlistname">Name der neuen Kontaktliste</Label>
			<Input type="text" id="contactlistname" placeholder="1x 2022/2025" class="w-full" name="contactlistname"/>
			<input type="text" id="contacts" name="contacts" class="hidden" bind:value={contactjson}>
			<input type="text" id="accessKey" name="accessKey" class="hidden" bind:value={$authStore.accessToken}>
			<Button>Neue Kontaktliste erstellen</Button>
		</form>

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name des neuen Kontakts</Table.Head>
					<Table.Head>E-Mail</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each contacts as contact}
					<Table.Row>
						<Table.Cell>{contact.name}</Table.Cell>
						<Table.Cell>{contact.email}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<Textarea bind:value={inputstring}/>
		<Button on:click={inputToObj} class="w-full">Kontakte importieren</Button>
	{/if} 
</div>