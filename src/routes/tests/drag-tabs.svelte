<script lang="ts">
    import { AnimatePresence, LayoutGroup, motion, MotionConfig, Reorder } from '$lib/motion-start';
    import { onMount } from 'svelte';

    interface Ingredient {
        icon: string;
        label: string;
    }

    const allIngredients: Ingredient[] = [
        { icon: '🍅', label: 'Tomato' },
        { icon: '🥬', label: 'Lettuce' },
        { icon: '🧀', label: 'Cheese' },
        { icon: '🥕', label: 'Carrot' },
        { icon: '🍌', label: 'Banana' },
        { icon: '🫐', label: 'Blueberries' },
        { icon: '🥂', label: 'Champers?' },
    ];

    const [tomato, lettuce, cheese] = allIngredients;
    const initialTabs = [tomato, lettuce, cheese];

    let tabs = $state<Ingredient[]>([...initialTabs]);
    let selectedTab = $state<Ingredient>(tabs[0]);

    function removeItem<T>(arr: T[], item: T): T[] {
        const newArr = [...arr];
        const index = newArr.indexOf(item);
        if (index > -1) newArr.splice(index, 1);
        return newArr;
    }

    function closestItem<T>(arr: T[], item: T): T {
        const index = arr.indexOf(item);
        if (index === -1) return arr[0];
        if (index === arr.length - 1) return arr[arr.length - 2];
        return arr[index + 1];
    }

    function getNextIngredient(ingredients: Ingredient[]): Ingredient | undefined {
        const existing = new Set(ingredients);
        return allIngredients.find((ingredient) => !existing.has(ingredient));
    }

    function remove(item: Ingredient) {
        if (item === selectedTab) {
            selectedTab = closestItem(tabs, item);
        }
        tabs = removeItem(tabs, item);
    }

    function add() {
        const nextItem = getNextIngredient(tabs);
        if (nextItem) {
            tabs = [...tabs, nextItem];
            selectedTab = nextItem;
        }
    }

    // Automatically repopulate tabs when they all close
    $effect(() => {
        if (!tabs.length) {
            const timer = setTimeout(() => {
                tabs = [...initialTabs];
                selectedTab = initialTabs[0];
            }, 2000);
            return () => clearTimeout(timer);
        }
    });
</script>

<style>
    :global(body) {
        width: 100vw;
        height: 100vh;
        background: #ff0055;
        overflow: hidden;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .window {
        width: 480px;
        height: 360px;
        border-radius: 10px;
        background: white;
        overflow: hidden;
        box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075);
        display: flex;
        flex-direction: column;
    }

    nav {
        background: #fdfdfd;
        padding: 5px 5px 0;
        border-radius: 10px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 1px solid #eeeeee;
        height: 44px;
        display: grid;
        grid-template-columns: 1fr 35px;
        max-width: 480px;
        overflow: hidden;
    }

    :global(.tabs) {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        flex-wrap: nowrap;
        width: 420px;
        padding-right: 10px;
    }

    main {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 128px;
        flex-grow: 1;
        user-select: none;
    }

    :global(ul), :global(li) {
        list-style: none;
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 14px;
    }

    :global(.tab) {
        border-radius: 5px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        width: 100%;
        padding: 10px 15px;
        position: relative;
        background: white;
        cursor: pointer;
        height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        user-select: none;
    }

    :global(.tab span) {
        color: black;
        flex-shrink: 1;
        flex-grow: 1;
        white-space: nowrap;
        display: block;
        min-width: 0;
        padding-right: 30px;
        mask-image: linear-gradient(to left, transparent 10px, #fff 30px);
        -webkit-mask-image: linear-gradient(to left, transparent 10px, #fff 30px);
    }

    :global(.close) {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-shrink: 0;
    }

    :global(.close button) {
        width: 20px;
        height: 20px;
        border: 0;
        background: #fff;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        stroke: #000;
        margin-left: 10px;
        cursor: pointer;
        flex-shrink: 0;
    }

    .add-item {
        width: 30px;
        height: 30px;
        background: #eee;
        border-radius: 50%;
        border: 0;
        cursor: pointer;
        align-self: center;
    }

    .add-item:disabled {
        opacity: 0.4;
        cursor: default;
        pointer-events: none;
    }
</style>

<MotionConfig transition={{ duration: 0.1 }}>
    <div class="window">
        <nav>
            <LayoutGroup>
                <Reorder.Group
                    as="ul"
                    axis="x"
                    onReorder={(newTabs) => tabs = newTabs}
                    class="tabs"
                    values={tabs}
                >
                    {#snippet children(item)}
                        <Reorder.Item
                            value={item}
                            id={item.label + '-tab'}
                            initial={{ opacity: 0, y: 30, transition: { duration: 0.15 } }}
                            animate={{
                                backgroundColor: selectedTab === item ? '#f3f3f3' : '#fff',
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.15 },
                            }}
                            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                            whileDrag={{ backgroundColor: '#e3e3e3' }}
                            class="tab {selectedTab === item ? 'selected' : ''}"
                            onPointerDown={() => selectedTab = item}
                            dragTransition={{ bounceStiffness: 10000, bounceDamping: 10000 }}
                        >
                            <motion.span layout="position" id={item.label + '-label'}>
                                {item.icon} {item.label}
                            </motion.span>
                            <motion.div layout class="close">
                                <motion.button
                                    id={item.label + '-remove'}
                                    onPointerDown={(event) => {
                                        event.stopPropagation();
                                        remove(item);
                                    }}
                                    initial={false}
                                    animate={{
                                        backgroundColor: selectedTab === item ? '#e3e3e3' : '#fff',
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M 3 3 L 17 17" fill="transparent" stroke-width="3" stroke-linecap="round" />
                                        <path d="M 17 3 L 3 17" fill="transparent" stroke-width="3" stroke-linecap="round" />
                                    </svg>
                                </motion.button>
                            </motion.div>
                        </Reorder.Item>
                    {/snippet}
                </Reorder.Group>
                <motion.button
                    class="add-item"
                    onclick={add}
                    disabled={tabs.length === allIngredients.length}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        style="transform: rotate(45deg); stroke: black;"
                    >
                        <path d="M 3 3 L 17 17" fill="transparent" stroke-width="3" stroke-linecap="round" />
                        <path d="M 17 3 L 3 17" fill="transparent" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </motion.button>
            </LayoutGroup>
        </nav>
        <main>
            <AnimatePresence mode="wait" initial={false} show={!!selectedTab}>
                {#snippet children()}
                    <motion.div
                        id={`${selectedTab ? selectedTab.label : 'empty'}-content`}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.15 }}
                    >
                        {selectedTab ? selectedTab.icon : '😋'}
                    </motion.div>
                {/snippet}
            </AnimatePresence>
        </main>
    </div>
</MotionConfig>
