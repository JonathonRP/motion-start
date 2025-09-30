<script>
  // Lucide Svelte
  import { Home, PencilLine, TvMinimalPlay } from "lucide-svelte";
  //    Shadcn Components
  import * as Tooltip from "$lib/components/ui/tooltip";
  //   Major Components
  import { Dock, DockIcon } from "./Dock";

  let navs = {
    navbar: [
      { label: "Docs", icon: Home, href: "/" },
      { label: "Test", icon: PencilLine, href: "/tests" },
    ],
  };
</script>

<div>
  <Dock
    direction="middle"
    class="fixed bottom-0 left-0 right-0"
    let:mouseX
    let:distance
    let:magnification
  >
    {#each navs.navbar as item}
      <a href={item.href}>
        <DockIcon {mouseX} {magnification} {distance}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger
                class="hover:bg-zinc-900/80 transition-all duration-200 rounded-full p-3 mx-0"
              >
                <svelte:component
                  this={item.icon}
                  size={22}
                  strokeWidth={1.2}
                />
              </Tooltip.Trigger>
              <Tooltip.Content sideOffset={8}>
                <p>{item.label}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </DockIcon>
      </a>
    {/each}
  </Dock>
</div>
