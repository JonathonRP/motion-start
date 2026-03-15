<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
	import {
		setMotionConfigContext,
		useMotionConfigContext,
	} from "../../context/MotionConfigContext.svelte";
	import type { MotionConfigProps } from "./index.js";
	import { loadExternalIsValidProp } from "../../render/dom/utils/filter-props.js";
	import type { Snippet } from "svelte";

	interface Props extends MotionConfigProps {
		children: Snippet;
	}

	let { isValidProp, children, ...config }: Props = $props();

	isValidProp && loadExternalIsValidProp(isValidProp);

	/**
	 * Inherit props from any parent MotionConfig components
	 */
	config = {
		...useMotionConfigContext(),
		...config,
	};

	config.isStatic = config.isStatic ?? false;

	setMotionConfigContext(config);
</script>

{@render children?.()}
