<svelte:options runes />

<script lang="ts">
import type { SpringOptions } from '../../animation/types.js';
import { useSpring } from '../use-spring.js';

interface Props {
	config?: SpringOptions;
}

let { config = {} }: Props = $props();

export const spring = useSpring(0, () => config);
</script>
