<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import {
        AnimateLayout,
        AnimatePresenceMode,
        AnimatePresenceStack,
        AnimationSequence,
        ColorInterpolation,
        CyclingThroughStates,
        Drag3DTransform,
        DragConstraints,
        DragDirectionLocking,
        DragTransform,
        DurBasedSpring,
        KeyFramesPosition,
        MorphSvg,
        ReorderList,
        Repeat,
        ReverseEffect,
        ScrollProgress,
        Spring,
        Tweened,
        WhileDragEffect,
        WhileHoverEffect,
        WhileTapEffect,
    } from "$lib/components/motion";

    import { RenderScan } from "svelte-render-scan";
    import { dev } from "$app/environment";
</script>

{#if dev}
    <RenderScan />
{/if}
<div class="grid gap-1 m-3 max-w-full">
    <h1 class="text-3xl font-bold mb-2">Functional Tests Motion Start</h1>
    <div class="grid lg:grid-cols-3 gap-2">
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Tweened</Card.Title>
                <Card.Description>
                    To test click the reload button below
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <Tweened />
            </Card.Content>
            <Card.Footer class="grid gap-1">
                <h1 class="text-2xl font-semibold">Test Summary</h1>
                <p class="text-green-500">Passed test</p>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Spring</Card.Title>
                <Card.Description>
                    To test click the reload button below
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <Spring />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Duration based Spring</Card.Title>
                <Card.Description>
                    To test click the reload button below
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <DurBasedSpring />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Repeat</Card.Title>
                <Card.Description>Just visualize the effect</Card.Description>
            </Card.Header>
            <Card.Content>
                <Repeat />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Reverse Effect</Card.Title>
                <Card.Description>Just visualize the effect</Card.Description>
            </Card.Header>
            <Card.Content>
                <ReverseEffect />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>While Hover Effect</Card.Title>
                <Card.Description>
                    Hover over the box to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <WhileHoverEffect />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>While Tap Effect</Card.Title>
                <Card.Description>
                    Tap the box to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <WhileTapEffect />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>While Drag Effect</Card.Title>
                <Card.Description>
                    Drag the box to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <WhileDragEffect />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Cycling through States</Card.Title>
                <Card.Description>
                    Click the box to cycle through different states
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <CyclingThroughStates />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Animation Sequence</Card.Title>
                <Card.Description>
                    Tap the box once to see the animation sequence
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <AnimationSequence />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Drag Constraints</Card.Title>
                <Card.Description>
                    Drag the box visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <DragConstraints />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Drag Direction Locking</Card.Title>
                <Card.Description>
                    Drag the box visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <DragDirectionLocking />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Drag Transform</Card.Title>
                <Card.Description>
                    Drag the box visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <DragTransform />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start  -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Drag 3D Transform</Card.Title>
                <Card.Description>
                    Drag the box visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <Drag3DTransform />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- Start -->
        <!-- End -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Color Interpolation</Card.Title>
                <Card.Description>
                    Drag the circle visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <ColorInterpolation />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Color Interpolation</Card.Title>
                <Card.Description>Just visualize the effect</Card.Description>
            </Card.Header>
            <Card.Content>
                <MorphSvg />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Scroll Progress</Card.Title>
                <Card.Description>
                    Drag to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <ScrollProgress />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Keyframes Position</Card.Title>
                <Card.Description>Just visualize the effect</Card.Description>
            </Card.Header>
            <Card.Content>
                <KeyFramesPosition />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Animated Presence Stack</Card.Title>
                <Card.Description>
                    Drag the cards sideways to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <AnimatePresenceStack />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Animate Layout</Card.Title>
                <Card.Description>
                    Click the switch to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <AnimateLayout />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-green-500">Passed test</p>
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Reorder List</Card.Title>
                <Card.Description>Move list items to reorder</Card.Description>
            </Card.Header>
            <Card.Content>
                <ReorderList />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <!-- <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-red-500">Failed test</p> -->
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
        <!-- Start -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Animate Presence Mode</Card.Title>
                <Card.Description>
                    Click the box to visualize the effect
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <AnimatePresenceMode />
            </Card.Content>
            <Card.Footer>
                <Card.Footer class="grid gap-1">
                    <!-- <h1 class="text-2xl font-semibold">Test Summary</h1>
                    <p class="text-red-500">Failed test</p> -->
                </Card.Footer>
            </Card.Footer>
        </Card.Root>
        <!-- End -->
    </div>
</div>
