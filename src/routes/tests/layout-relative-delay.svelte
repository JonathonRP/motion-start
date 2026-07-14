<script lang="ts">
import { m, LazyMotion, domMax } from '$lib/motion-start';

let state = $state(true);
let frameCount = 0;
</script>

<LazyMotion features={domMax}>
    <m.div
        id="parent"
        onclick={() => state = !state}
        layout
        style={{
            position: 'absolute',
            top: state ? '0px' : '200px',
            left: state ? '0px' : '200px',
            width: state ? '200px' : '400px',
            height: '200px',
            background: 'red',
        }}
        transition={{
            ease: (t) => {
                frameCount++;
                // This is a bit funny but boxes are resolved relatively after
                // the first frame
                return frameCount > 1 ? 0.5 : t;
            },
        }}
    >
        <m.div
            id="child"
            layout
            style={{
                width: state ? '100px' : '200px',
                height: '100px',
                background: 'blue',
            }}
            transition={{
                delay: 100,
            }}
        />
    </m.div>
</LazyMotion>
