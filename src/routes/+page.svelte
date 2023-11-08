<svelte:head>
	<title>Startseite</title>
</svelte:head>

<script>
    import Button from "$lib/components/ui/button/button.svelte";
</script>


<section class="flex justify-center items-center h-full">
    <div class="flex flex-col items-start gap-3 px-10">
        <h1 class="text-5xl font-bold tracking-tighter leading-[1.1]">IT@Primarschule Muenchenstein</h1>
        <p class="max-w-[750px] text-xl text-muted-foreground">Willkommen auf dem IT-Portal der Primarschule Münchenstein. Hier kannst du verschiedene automatisierte Prozesse starten, die dir bei der Verwaltung deiner IT-Aufgaben helfen.</p>

        <section class="flex w-full items-center space-x-4 pb-8 pt-4">
            <Button href="/start">Los gehts</Button>
            <Button href="https://www.schule-muenchenstein.ch/" variant="outline">zur offiziellen Homepage</Button>
        </section>
    </div>
</section>