<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";

    import { login } from "$lib/msal";
</script>

<section class="flex justify-center items-center h-full">
    <div class="flex flex-col items-start gap-3 px-10">
        <h1 class="text-5xl font-bold tracking-tighte leading-[1.1]">Login</h1>
        <p class="max-w-[510px] text-xl text-muted-foreground">Bitte logge dich mit deiner @schule-muenchenstein.ch E-Mail Adresse ein, um das Portal zu nutzen.</p>

        <section class="flex w-full items-center space-x-4 pb-8 pt-4">
            <Button on:click={login}>Einloggen mit Microsoft</Button>
            <Button href="/" variant="outline">zur Startseite</Button>
        </section>
    </div>
</section>
