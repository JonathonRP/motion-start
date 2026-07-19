<script lang="ts">
import { motion } from '../../index.js';
import type { EventInfo } from '../../events/types.js';
import type { TapInfo } from '../../gestures/types.js';

interface Props {
	onTap?: (event: PointerEvent, info: TapInfo) => void;
	onTapStart?: (event: PointerEvent, info: TapInfo) => void;
	onHoverStart?: (event: MouseEvent, info: EventInfo) => void;
	onHoverEnd?: (event: MouseEvent, info: EventInfo) => void;
}

let { onTap, onTapStart, onHoverStart, onHoverEnd }: Props = $props();
</script>

<motion.button id="gesture-target" {onTap} {onTapStart} {onHoverStart} {onHoverEnd}>target</motion.button>
