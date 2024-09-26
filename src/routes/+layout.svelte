<script>
    import { Navbar } from "$lib/motion";
    import "../app.css";
    import { ModeWatcher, setMode } from "mode-watcher";
    setMode("dark");
    // let { children } = $props()
</script>

<ModeWatcher />
<slot />
<Navbar />
