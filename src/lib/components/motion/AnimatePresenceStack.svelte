<script>
  import { AnimatePresence } from "$lib/motion-start";
  import Card from "$lib/components/Card.svelte";

  let index = 0;
  let exitX = 0;

  $: mint = index + 1;

  function handleDragEnd(_, info) {
    if (info.offset.x < -100) {
      exitX = -250;
      index = index + 1;
    }
    if (info.offset.x > 100) {
      exitX = 250;
      index = index + 1;
    }
  }

  /**
 * This example demonstrates how to create a stack of cards that can be dragged and dismissed using Animate
<div
    class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
>
    <AnimatePresence initial={false} let:item list={[{ key: index }]}>
        <Card bind:index={mint} frontCard={false} />
        <Card bind:index drag="x" frontCard={true} />
    </AnimatePresence>
</div>
*/
</script>

<div
  class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
>
  <AnimatePresence
    initial={false}
    let:item
    list={[
      { key: index, isFront: true },
      { key: mint, isFront: false },
    ]}
  >
    <Card
      bind:index={item.key}
      drag={item.isFront ? "x" : false}
      frontCard={item.isFront}
      onDragEnd={item.isFront ? handleDragEnd : undefined}
      custom={exitX}
    />
  </AnimatePresence>
</div>
