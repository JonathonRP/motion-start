<script lang="ts">
    import { Reorder, useMotionValue, animate } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    const axis = $derived((page.url.searchParams.get('axis') || 'y') as 'x' | 'y');

    const initialItems = ['Tomato', 'Cucumber', 'Mustard', 'Chicken'];
    let items = $state([...initialItems]);

    const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

    function handleReorder(newItems: string[]) {
        items = newItems;
    }
</script>

<Reorder.Group
    axis={axis}
    onReorder={handleReorder}
    style={axis === 'y' ? {} : { display: 'flex' }}
    values={items}
>
    {#each items as item (item)}
        <Reorder.Item
            value={item}
            id={item}
            style={{ boxShadow: inactiveShadow }}
            dragTransition={{ bounceStiffness: 2000, bounceDamping: 10000 }}
            transition={{ duration: 0.1 }}
        >
            <span>{item}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 39 39"
                width="39"
                height="39"
            >
                <path d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z" fill="#CCC"></path>
                <path d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z" fill="#CCC"></path>
                <path d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z" fill="#CCC"></path>
                <path d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z" fill="#CCC"></path>
                <path d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z" fill="#CCC"></path>
                <path d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z" fill="#CCC"></path>
                <path d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z" fill="#CCC"></path>
                <path d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z" fill="#CCC"></path>
                <path d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z" fill="#CCC"></path>
            </svg>
        </Reorder.Item>
    {/each}
</Reorder.Group>

<style>
    :global(body) {
        width: 100vw;
        height: 100vh;
        background: #ffaa00;
        overflow: hidden;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(ul), :global(li) {
        list-style: none;
        padding: 0;
        margin: 0;
        font-family: GT Walsheim, sans-serif;
        font-weight: 700;
        font-size: 24px;
    }

    :global(ul) {
        position: relative;
        width: 300px;
    }

    :global(li) {
        border-radius: 10px;
        margin-bottom: 10px;
        width: 100%;
        padding: 20px;
        position: relative;
        background: white;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    :global(li svg) {
        width: 18px;
        height: 18px;
        cursor: grab;
    }
</style>
