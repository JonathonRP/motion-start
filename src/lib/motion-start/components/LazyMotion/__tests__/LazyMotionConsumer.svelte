<script lang="ts">
	import { useLazyContext } from '../../../context/LazyContext.js';

	const context = useLazyContext();
</script>

<output data-testid="lazy-renderer">{context.renderer ? 'loaded' : 'pending'}</output>
