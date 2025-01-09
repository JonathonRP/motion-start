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
  import { useContext } from "../../context/utils/context";
  import { LayoutGroupContext } from "../../context/LayoutGroupContext";
  import { DeprecatedLayoutGroupContext } from "../../context/DeprecatedLayoutGroupContext";
  import { nodeGroup } from "../../projection/node/group";
  import { useForceUpdate } from "../../utils/use-force-update.svelte";
  import type { MutableRefObject } from "../../utils/safe-react-types";
  import type { Snippet } from "svelte";

  interface Props extends LayoutGroupProps {
    children?: Snippet;
  }

  let { id, inherit = true, children }: Props = $props();

  const layoutGroupContext = useContext(LayoutGroupContext);

  const deprecatedLayoutGroupContext = useContext(DeprecatedLayoutGroupContext);

  const [forceRender, key] = $derived([...useForceUpdate()]);

  let context = {
    current: null,
  } as MutableRefObject<LayoutGroupContext | null>;

  const upstreamId = $derived(
    layoutGroupContext.current?.id || deprecatedLayoutGroupContext.current,
  );

  $effect(() => {
    if (context.current === null) {
      if (shouldInheritId(inherit!) && upstreamId) {
        id = id ? upstreamId + "-" + id : upstreamId;
      }

      context.current = {
        id,
        group: shouldInheritGroup(inherit!)
          ? layoutGroupContext.current?.group || nodeGroup()
          : nodeGroup(),
      };
    }
  });

  const memo = $derived((_key: typeof key) => {
    return {
      ...context.current,
      forceRender,
    };
  });

  $effect.pre(() => {
    LayoutGroupContext.Provider = memo(key);
  });
</script>

{@render children?.()}
