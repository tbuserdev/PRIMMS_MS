<svelte:head>
	<title>Kalender</title>
</svelte:head>

<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import * as Table from "$lib/components/ui/table";
	import { Separator } from "$lib/components/ui/separator";
	import * as RadioGroup from "$lib/components/ui/radio-group";
	import { Button } from "$lib/components/ui/button";
	import * as Alert from "$lib/components/ui/alert";

	import { authStore } from "$lib/authStore";
	import Papa from 'papaparse';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	export let form;
	let csvData: any[];
	let csvDataString: string;
	let showmessage: boolean = false;

	const currentyear = new Date().getFullYear();
    const lastyear = currentyear - 1;
    const nextyear = currentyear + 1;
    const yearlist: readonly [string, string, string] = [lastyear.toString(), currentyear.toString(), nextyear.toString()] as const;
	let selectedyear = currentyear.toString();

	// UTILS FUNCTIONS
	function getDates(geb: string) {
		let year = parseInt(selectedyear.toString());
		let date_parts = geb.toString().split('.');
		let month = parseInt(date_parts[1]) - 1;
		let day = parseInt(date_parts[0]);

		let previewDate = day + '.' + (month + 1) + '.' + year;
		let startDate = new Date(year, month, day, 0, 0, 0, 0);
		let endDate = new Date(year, month, day, 0, 0, 0, 0);
		endDate.setDate(endDate.getDate() + 1);

		let start = startDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
		let end = endDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });

		return { previewDate, start, end };
	}

	function updateDates() {
		if (csvData == null || csvData == undefined) return;
		let newCsvData = csvData;
		for (const row of newCsvData) {
			const { previewDate, start, end } = getDates(row.previewDate);
			row.previewDate = previewDate;
			row.start.dateTime = start;
			row.end.dateTime = end;
			csvDataString = JSON.stringify(csvData).replace(/"/g, '&quot;');
		}		
		csvData = newCsvData;
	}

	// EVENT HANDLER
	function handleYearChange(e: any) {
    	selectedyear = e.detail.currentTarget.id;
		updateDates();
  	}

	async function handleFileUpload(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result?.toString();
			if (result != null && result != "") {

				csvData = [];
				const parsed_csv = Papa.parse(result, { header: true });

				const headers = parsed_csv.meta.fields;
				const required = ['Vorname', 'Name', 'Geb'];

				if (headers != null) {
					const missing = required.filter(r => !headers.includes(r));

					if (missing.length > 0) {
						alert('Die Datei ist ungültig!');
						return;
					} else {
						let csv: any[] = parsed_csv.data;

						for (const row of csv) {
							if (row != null && row.Name != "") {
								let name: string = row.Vorname + ' ' + row.Name + ' (' + row.Kü + ')'
								const { previewDate, start, end } = getDates(row.Geb);

								let event = {
									summary: name,
									previewDate: previewDate,
									start: {
										dateTime: start.toString(),
										timeZone: 'Europe/Berlin'
									},
									end: {
										dateTime: end.toString(),
										timeZone: 'Europe/Berlin'
									}
								}
								csvData.push(event);
							}
						}

						csvDataString = JSON.stringify(csvData).replace(/"/g, '&quot;');
						csvData.sort((a, b) => {
							let dateA = new Date(a.start.dateTime);
							let dateB = new Date(b.start.dateTime);
							return dateA.getTime() - dateB.getTime();
						});
					}
				} else {
					alert('Die Datei ist ungültig!');
				}
			} else {
				alert('Die Datei ist ungültig!');
        	}
    	}
		reader.readAsText(file);
	}

	$: if (form?.success || form?.error || showmessage) {
		showmessage = true;
		setTimeout(() => {
			showmessage = false;
		}, 7500);
	}

	$: csvData, updateDates();

</script>

<!-- Title -->
<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Kalender Update</h3>
		<p class="text-sm text-muted-foreground">Hier kannst du automatisch deinen Kalender updaten</p>
	</div>

	<!-- Success & Error Messsages -->
	{#if showmessage}
		<div transition:fade={{ duration: 500 }}>
			{#if form?.success}
				<Alert.Root class="mt-4 border-green-500">
					<Alert.Title class="text-green-500">Erfolgreich!</Alert.Title>
					<Alert.Description class="text-green-500">{form?.message}</Alert.Description>
				</Alert.Root>
			{:else if form?.error}
				<Alert.Root class="mt-4 border-red-500">
					<Alert.Title class="text-red-500">Fehlgeschlagen!</Alert.Title>
					<Alert.Description class="text-red-500">{form?.message}</Alert.Description>
				</Alert.Root>
			{:else}
				<Alert.Root class="mt-4 border-blue-500">
					<Alert.Title class="text-blue-500">Ausführung gestartet...</Alert.Title>
					<Alert.Description class="text-blue-500">Bitte einen Moment warten...</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	{/if}

	<!-- SAL CSV -->
	<div class="space-y-2">
        <Label for="data">Exportiertes SAL-CSV</Label>
        <Input id="data" type="file" accept=".csv," on:change={handleFileUpload}/>
    </div>

	<!-- Select Year -->
	<div class="space-y-3">
		<Label for="data">Wähle das Jahr, in dem die Geburtstage eingefügt werden sollen</Label>
		<RadioGroup.Root bind:value={selectedyear}>
			<div class="flex items-center space-x-6">
				{#each yearlist as year}
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value={year} id={year} on:click={handleYearChange}/>
						<Label for="all" class="font-normal">{year}</Label>
					</div>
				{/each}
			</div>
		  </RadioGroup.Root>
	</div>

	<!-- Buttons -->
	<div class="sm:flex sm:space-x-4 space-y-2 sm:space-y-0">
		<form action="/calendar?/create" method="POST" use:enhance on:submit={() => showmessage=true}>
			<input type="hidden" name="eventArray" bind:value={csvDataString}/>
			<input type="hidden" name="accessKeyCreate" bind:value={$authStore.accessToken}/>
			{#if csvData != null}
				<Button class="w-full">Kalendereinträge einfügen</Button>
			{:else}
				<Button class="w-full" disabled>Kalendereinträge einfügen</Button>
			{/if}
		</form>
		
		<form action="/calendar?/delete" method="POST" use:enhance on:submit={() => showmessage=true}>
			<input type="hidden" name="accessKeyDelete" bind:value={$authStore.accessToken}/>
			<Button class="w-full" variant="destructive">Alle Kalendereinträge löschen</Button>
		</form>
	</div>

	<Separator />

	<!-- CSV Data to be inserted -->
	{#if csvData != null}
		<p class="text-sm text-muted-foreground text-center">{csvData.length} Kalendereinträge</p>

		<Table.Root>
			<Table.Header>
			  <Table.Row>
				<Table.Head>Event-Name</Table.Head>
				<Table.Head>Datum</Table.Head>
			  </Table.Row>
			</Table.Header>
			<Table.Body>
			  {#each csvData as csvRow}
				<Table.Row>
				  <Table.Cell>{csvRow.summary}</Table.Cell>
				  <Table.Cell>{csvRow.previewDate}</Table.Cell>
				</Table.Row>
			  {/each}
			</Table.Body>
		  </Table.Root>
	{/if}
</div>
