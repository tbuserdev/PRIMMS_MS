<script lang="ts">
    import { authStore } from "$lib/authStore";
</script>


<h3 class="text-lg font-medium">Willkommen {$authStore.name} im IT-Portal</h3>
<p class="text-sm text-muted-foreground mb-10">Auf der linken Seite siehst du die verschiedenen Angebote.</p>

<p class="text-sm text-muted-foreground">
    Folgende Daten von dir sind verfügbar:
</p>
  

<ul class="my-6 ml-6 list-disc [&>li]:mt-2 text-sm text-muted-foreground">
    <li>Name: {$authStore.name}</li>
    <li>E-Mail Adresse: {$authStore.email}</li>
</ul>
  
  