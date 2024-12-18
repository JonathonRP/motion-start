<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" generics="T extends {key:any}">
    import { Previous } from "runed";
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import { useContext } from "../../context/utils/context.svelte.js";
    import { LayoutGroupContext } from "../../context/LayoutGroupContext.js";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import { fromStore } from "svelte/store";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { onDestroy, onMount, untrack, type Snippet } from "svelte";
    import { type ComponentKey, getChildKey } from "./utils.js";
    import { invariant } from "../../utils/errors.js";

    type Props = AnimatePresenceProps<ConditionalGeneric<T>> & {
        children?: Snippet<[typeof list | { key: number }]>;
    };

    let {
        exitBeforeEnter,
        custom,
        initial,
        onExitComplete,
        presenceAffectsLayout = true,
        mode = "sync",
        list,
        show,
        children,
    }: Props = $props();

    invariant(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");

    let _list = $state(list !== undefined ? list : show ? [{ key: 1 }] : []);

    let presentChildren = $derived(_list);
    let presentKeys = $derived(presentChildren.map(getChildKey));

    let isInitialRender = true;

    let renderedChildren = $derived([
        ...presentChildren.map((v) => ({
            present: true,
            item: v,
            key: v.key,
            onExit: undefined,
        })),
    ]);

    let exitingChildren = new Previous(() =>
        renderedChildren.map((v) => ({ ...v, present: false })),
    );

    const exitingKeys = new SvelteSet<number>();

    const layoutContext = fromStore(useContext(LayoutGroupContext));
    const forceRender = () => {
        layoutContext.current.forceRender?.();
        _list = [..._list];
    };

    $inspect(exitingChildren);

    onMount(() => {
        isInitialRender = false;
    });

    $effect.pre(() => {
        if (
            !isInitialRender &&
            exitingChildren.current &&
            exitingChildren.current.length !== 0
        ) {
            let nextChildren = [...presentChildren];
            /**
             * Update complete status of exiting children.
             */
            for (let i = 0; i < _list.length; i++) {
                const child = renderedChildren[i];
                const key = _list[i].key;

                if (!presentKeys.includes(key)) {
                    nextChildren.splice(i, 0, child);
                    exitingKeys.add(key!);
                }
            }

            /**
             * If we're in "wait" mode, and we have exiting children, we want to
             * only render these until they've all exited.
             */
            if (mode === "wait" && exitingKeys.size) {
                renderedChildren.length = 0;
            }

            exitingKeys.forEach((key) => {
                const child = nextChildren.find((e) => e.key === key);
                renderedChildren.splice(presentKeys.indexOf(key), 0, {
                    present: false,
                    item: child,
                    key: getChildKey(child),
                    onExit:
                        exitingKeys.has(key) && child
                            ? () => {
                                  exitingChildren.delete(key!);

                                  // Remove this child from the present children
                                  const removeIndex = presentChildren.findIndex(
                                      (presentChild) =>
                                          presentChild.key === key,
                                  );

                                  if (removeIndex < 0) {
                                      return;
                                  }
                                  presentChildren.splice(removeIndex, 1);

                                  // Defer re-rendering until all exiting children have indeed left
                                  if (!exitingChildren.size) {
                                      _list = [..._list];
                                      forceRender?.();
                                      onExitComplete && onExitComplete();
                                  }
                              }
                            : undefined,
                });
            });

            /**
             * Early return to ensure once we've set state with the latest diffed
             * children, we can immediately re-render.
             */
            // untrack(() => (renderedChildren = nextChildren));
        }
    });

    if (
        process.env.NODE_ENV !== "production" &&
        mode === "wait" &&
        renderedChildren.length > 1
    ) {
        console.warn(
            `You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`,
        );
    }
</script>

{#each renderedChildren as child (getChildKey(child))}
    <PresenceChild
        {mode}
        isPresent={child.present}
        initial={!isInitialRender || initial ? undefined : false}
        custom={child.onExit ? custom : undefined}
        {presenceAffectsLayout}
        onExitComplete={child.onExit}
    >
        {@render children?.(child.item)}
    </PresenceChild>
{/each}
