<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
  type InheritOption = boolean | "id";

  export interface LayoutGroupProps {
    id?: string;
    inherit?: InheritOption;
  }

  const shouldInheritGroup = (inherit: InheritOption) => inherit === true;
  const shouldInheritId = (inherit: InheritOption) =>
    shouldInheritGroup(inherit === true) || inherit === "id";
</script>

<script lang="ts">
  import { useContext } from "../../context/use";
  import { LayoutGroupContext } from "../../context/LayoutGroupContext";
  import { DeprecatedLayoutGroupContext } from "../../context/DeprecatedLayoutGroupContext";
  import { nodeGroup } from "../../projection/node/group";
  import { useForceUpdate } from "../../utils/use-force-update.svelte";
  import type { MutableRefObject } from "../../utils/safe-react-types";
  import { untrack, type Snippet } from "svelte";

  interface Props extends LayoutGroupProps {
    children?: Snippet;
  }

  let { id, inherit = true, children }: Props = $props();

  const layoutGroupContext = $derived(useContext(LayoutGroupContext).current);

  const deprecatedLayoutGroupContext = $derived(
    useContext(DeprecatedLayoutGroupContext).current,
  );

  const [forceRender, key] = useForceUpdate();

  const context = $state<MutableRefObject<LayoutGroupContext | null>>({
    current: null,
  });

  const upstreamId = $derived(
    layoutGroupContext?.id || deprecatedLayoutGroupContext,
  );

  const memoizedContext = $derived.by(() => {
    if (context.current === null) {
      if (shouldInheritId(inherit!) && upstreamId) {
        id = id ? upstreamId + "-" + id : upstreamId;
      }

      context.current = {
        id,
        group: shouldInheritGroup(inherit!)
          ? layoutGroupContext?.group || nodeGroup()
          : nodeGroup(),
      };
    }

    return ((_key: typeof key) => ({
      ...context.current,
      forceRender,
    }))(key);
  });

  $effect.pre(() => {
    memoizedContext;
    untrack(() => (LayoutGroupContext.Provider = memoizedContext));
  });
</script>

{@render children?.()}
