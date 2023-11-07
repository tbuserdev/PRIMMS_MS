<script lang="ts">
    import { authStore } from "$lib/authStore";
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Hallo {$authStore.name}</h3>
	</div>
</div>

