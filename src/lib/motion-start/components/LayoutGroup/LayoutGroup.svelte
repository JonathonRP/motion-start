<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
	type InheritOption = boolean | "id" | "group";

	export interface LayoutGroupProps {
		id?: string;
		inherit?: InheritOption;
		children?: any;
	}

	/**
	 * Hook to create and manage a layout group
	 * Handles group inheritance, force updates, and context management
	 */
	export function useLayoutGroupProvider(props: LayoutGroupProps) {
		// Get parent group context if it exists
		const oldId = $derived(
			useDeprecatedLayoutGroupContext().current ?? undefined,
		);
		const parentGroup = $derived(
			useLayoutGroupContext().current || { id: oldId },
		);
		const [forceRender, key] = useForceUpdate();

		const context = $derived({
			id: getGroupId(props, parentGroup),
			group: getGroup(props, parentGroup),
			forceRender,
			get key() {
				return key();
			},
		});

		// Make group context available to children
		return () =>
			setLayoutGroupContext({
				get current() {
					return context;
				},
			}).current as typeof context;
	}

	/**
	 * Determines the group ID based on inheritance rules
	 */
	function getGroupId(
		props: LayoutGroupProps,
		parentGroup: LayoutGroupContext | null,
	) {
		const shouldInherit = props.inherit === true || props.inherit === "id";
		const parentId = parentGroup?.id;

		if (shouldInherit && parentId) {
			return props.id ? `${parentId}-${props.id}` : parentId;
		}
		return props.id;
	}

	/**
	 * Creates or inherits a node group based on inheritance rules
	 */
	function getGroup(
		props: LayoutGroupProps,
		parentGroup: LayoutGroupContext | null,
	) {
		const shouldInherit =
			props.inherit === true || props.inherit === "group";
		return shouldInherit ? parentGroup?.group || nodeGroup() : nodeGroup();
	}
</script>

<script lang="ts">
	import {
		type LayoutGroupContext,
		setLayoutGroupContext,
		useLayoutGroupContext,
	} from "../../context/LayoutGroupContext.svelte";
	import { useDeprecatedLayoutGroupContext } from "../../context/DeprecatedLayoutGroupContext";
	import { nodeGroup } from "../../projection/node/group";
	import { useForceUpdate } from "../../utils/use-force-update.svelte";
	import { type Snippet } from "svelte";

	interface Props extends LayoutGroupProps {
		children: Snippet<
			[
				props: {
					forceRender: VoidFunction;
					key: number;
				},
			]
		>;
	}

	let { id, inherit = true, children }: Props = $props();

	const { forceRender, key } = $derived.by(
		useLayoutGroupProvider({
			get inherit() {
				return inherit;
			},
			get id() {
				return id;
			},
		}),
	);
</script>

{@render children({ forceRender, key })}
