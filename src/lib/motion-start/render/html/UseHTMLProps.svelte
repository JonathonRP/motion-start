<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import type { HTMLProps } from './types';
import UseStyle from './UseStyle.svelte';

let { props, visualState, isStatic }: { props: any; visualState: any; isStatic: any } = $props();

const getHTMLProps = (style: HTMLProps['style'], props: { drag: string | boolean }) => {
	let htmlProps: HTMLProps = {
		draggable: false,
		style: {
			userSelect: undefined,
			WebkitUserSelect: undefined,
			WebkitTouchCallout: undefined,
			touchAction: undefined,
		},
	};
	if (Boolean(props.drag)) {
		// Disable the ghost element when a user drags
		htmlProps.draggable = false;

		// Disable text selection
		style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = 'none';

		// Disable scrolling on the draggable direction
		style.touchAction = props.drag === true ? 'none' : `pan-${props.drag === 'x' ? 'y' : 'x'}`;
	}

	htmlProps.style = style;
	return htmlProps;
};
</script>

<UseStyle let:styles {visualState} {props} {isStatic}>
  <slot visualProps={getHTMLProps(styles, props)} />
</UseStyle>
