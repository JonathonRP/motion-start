<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { UseFocusGesture } from './use-focus-gesture.js';
import { UseHoverGesture } from './use-hover-gesture.js';
import { UsePanGesture } from './use-pan-gesture.js';
import { UseTapGesture } from './use-tap-gesture.js';

let { props, visualElement }: { props: any; visualElement: any } = $props();
</script>

<UsePanGesture {props} {visualElement} />
<UseTapGesture {props} {visualElement} />
<UseHoverGesture {props} {visualElement} />
<UseFocusGesture {props} {visualElement} />
<slot />
