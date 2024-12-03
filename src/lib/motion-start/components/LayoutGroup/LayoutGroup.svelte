<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module" module>
  type InheritOption = boolean | "id";

  export interface Props {
    id?: string;
    inherit?: InheritOption;
  }

  const shouldInheritGroup = (inherit: InheritOption) => inherit === true;
  const shouldInheritId = (inherit: InheritOption) =>
    shouldInheritGroup(inherit === true) || inherit === "id";
</script>

<script lang="ts">
  import { useContext } from "../../context/utils/context.svelte";
  import { LayoutGroupContext } from "../../context/LayoutGroupContext";
  import { DeprecatedLayoutGroupContext } from "../../context/DeprecatedLayoutGroupContext";
  import { nodeGroup } from "../../projection/node/group";
  import { useForceUpdate } from "../../utils/use-force-update";
  import type { MutableRefObject } from "../../utils/safe-react-types";

  type $$Props = Props;

  export let id: $$Props["id"] = undefined,
    inherit: $$Props["inherit"] = true,
    isCustom = false;

  const layoutGroupContext = useContext(LayoutGroupContext, isCustom);

  const deprecatedLayoutGroupContext = useContext(
    DeprecatedLayoutGroupContext,
    isCustom,
  );

  const [forceRender, key] = useForceUpdate();

  let context = {
    current: null,
  } as MutableRefObject<LayoutGroupContext | null>;

  const upstreamId = $layoutGroupContext.id || $deprecatedLayoutGroupContext;

  if (context.current === null) {
    if (shouldInheritId(inherit!) && upstreamId) {
      id = id ? upstreamId + "-" + id : upstreamId;
    }

    context.current = {
      id,
      group: shouldInheritGroup(inherit!)
        ? $layoutGroupContext.group || nodeGroup()
        : nodeGroup(),
    };
  }

  $: if (context.current === null) {
    if (shouldInheritId(inherit!) && upstreamId) {
      id = id ? upstreamId + "-" + id : upstreamId;
    }

    context.current = {
      id,
      group: shouldInheritGroup(inherit!)
        ? $layoutGroupContext.group || nodeGroup()
        : nodeGroup(),
    };
  }

  const memo = (_key: typeof key) => {
    return {
      ...context.current,
      forceRender,
    };
  };

  $: LayoutGroupContext.Provider = memo(key);
</script>

<slot />
