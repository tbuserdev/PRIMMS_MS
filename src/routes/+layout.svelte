<script>
	import "../app.postcss";

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
 
	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="h-screen-dvh">
	<slot />
	<div class="hidden dark">initate dark class</div>
</div>
