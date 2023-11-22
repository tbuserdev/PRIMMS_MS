<svelte:head>
	<title>Abwesenheitsmeldung</title>
</svelte:head>


<script lang="ts">    
	import { authStore, userStore } from "$lib/authStore";
	import { Button } from "$lib/components/ui/button";

    import { onMount } from "svelte";
	import { PDFDocument } from "pdf-lib";

	let form: any;

	import abwesenheitsmeldung from "$lib/assets/abwesenheitsmeldung.pdf";

	// read pdf
	async function readPdf() {
		const pdfBytes = await fetch(abwesenheitsmeldung).then(res => res.arrayBuffer());
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const form = pdfDoc.getForm();
		const fields = form.getFields();
		console.log(fields);
		output = form;
	}

	let output: any;
</script>

<Button on:click={readPdf}>Load PDF</Button>
<p>{output}</p>