<script>
  import { Navbar } from "$lib/components/motion";
  import "../app.css";
  import { ModeWatcher, setMode } from "mode-watcher";
  // let { children } = $props()
</script>

<ModeWatcher track={false} defaultMode={"dark"} />
<slot />
<Navbar />
