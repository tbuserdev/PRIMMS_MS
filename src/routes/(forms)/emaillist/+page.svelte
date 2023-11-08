<svelte:head>
	<title>E-Mail Liste</title>
</svelte:head>

<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Button } from "$lib/components/ui/button";
	import * as Table from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";
  	import { Label } from "$lib/components/ui/label";

	import { Client } from '@microsoft/microsoft-graph-client';
	import { authStore } from "$lib/authStore";
    import { get } from "svelte/store";

	let inputstring = "";
	let contacts: any[] = [];
	let contactlistname = "";

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
	}

	async function addNewContactList() {
		console.log(get(authStore).accessToken);
		const client = Client.init({
			authProvider: (done) => {
				done(null, get(authStore).accessToken);
			},
		});

		if (contactlistname != "") {
			contactlistname = "Neue Kontaktliste";

			let contactlist = await client.api("/me/contactFolders").post({
				displayName: contactlistname
			});
			console.log("Hallo: ", contactlist);
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Benutzerdefinierte Kontaktgruppen</h3>
		<p class="text-sm text-muted-foreground">Erstelle Kontaktgruppen mit der du von deinem gewohnten Postfach verschiedene Gruppen kontaktieren kannst. </p>
	</div>
	<Separator />
	{#if contacts.length > 0}
		<div class="flex flex-col w-full space-y-5">
			<Label for="contactlistname">Name der neuen Kontaktliste</Label>
			<Input type="text" id="contactlistname" placeholder="1x 2022/2025" class="w-full" bind:value={contactlistname}/>
			<Button on:click={addNewContactList}>Neue Kontaktliste erstellen</Button>
		</div>

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
		<Textarea bind:value={inputstring} />
		<Button on:click={inputToObj} class="w-full">Kontakte importieren</Button>
	{/if} 
</div>