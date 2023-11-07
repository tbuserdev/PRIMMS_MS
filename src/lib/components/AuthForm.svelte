<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import logo from "$lib/assets/logo.png";

    import { login } from "$lib/msal";
</script>

<div class="h-screen flex justify-center items-center z-10">
    <Card.Root>
            <Card.Header>
                <div class="flex justify-center">
                    <img src="{logo}" alt="Logo Primarschule Münchenstein" class="w-[140px] mb-3">
                </div>
                <Card.Title class="text-center">Primarschule Münchenstein</Card.Title>
            </Card.Header>
            <Card.Content>
                <Button on:click={login} class="w-full">Login</Button>
            </Card.Content>
    </Card.Root>
</div>





  
  