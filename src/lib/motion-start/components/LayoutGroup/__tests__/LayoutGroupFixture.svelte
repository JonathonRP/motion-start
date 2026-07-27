<script lang="ts">
import LayoutGroup from '../LayoutGroup.svelte';
import LayoutGroupConsumer from './LayoutGroupConsumer.svelte';
</script>

<LayoutGroup id="a">
	<LayoutGroupConsumer id="first" />
</LayoutGroup>

<LayoutGroup id="a">
	<LayoutGroup id="b">
		<LayoutGroupConsumer id="nested" />
	</LayoutGroup>
</LayoutGroup>

<LayoutGroup id="a">
	<LayoutGroup id={undefined}>
		<LayoutGroupConsumer id="undefined" />
	</LayoutGroup>
</LayoutGroup>

<LayoutGroup id="a">
	<LayoutGroup id={undefined}>
		<LayoutGroup id="b">
			<LayoutGroupConsumer id="nested-after-undefined" />
		</LayoutGroup>
	</LayoutGroup>
</LayoutGroup>
