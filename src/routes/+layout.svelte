<script>
    import "../app.postcss";
    import { ModeWatcher } from "mode-watcher";
</script>

<div class="h-screen">
    <slot />
</div>
<ModeWatcher />

