<script lang="ts">
    let scrollProgress = $state(0);
    let scrollY = $state(0);
    let inView = $state(false);

    function handleScroll() {
        scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    }

    $effect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll);
            handleScroll(); // Initial call
            return () => window.removeEventListener("scroll", handleScroll);
        }
    });

    // Intersection observer for whileInView
    let whileInViewElement: HTMLDivElement;

    $effect(() => {
        if (typeof window !== "undefined" && whileInViewElement) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        inView = entry.isIntersecting;
                    });
                },
                { threshold: 0.5 },
            );

            observer.observe(whileInViewElement);
            return () => observer.disconnect();
        }
    });
</script>

<div class="scroll-container">
    <h1>Phase D: Scroll Basics</h1>

    <!-- Scroll Progress Indicator -->
    <div class="fixed-header">
        <p>
            Scroll Progress: <span id="scroll-progress"
                >{scrollProgress.toFixed(2)}</span
            >
        </p>
    </div>

    <!-- Spacer to enable scrolling -->
    <div style="height: 500px;"></div>

    <!-- whileInView animated element -->
    <div
        bind:this={whileInViewElement}
        id="while-in-view-box"
        role="region"
        aria-label="Viewport animation box"
        class="animated-box"
        style="opacity: {inView ? 1 : 0}; transform: translateY({inView
            ? 0
            : 50}px); transition: opacity 0.5s, transform 0.5s;"
    >
        I animate when in view
    </div>

    <!-- More spacer -->
    <div style="height: 300px;"></div>

    <!-- Scroll-linked animation -->
    <div
        id="scroll-animated-box"
        role="region"
        aria-label="Scroll-linked animation box"
        class="animated-box"
        style="transform: translateX({scrollProgress * 200}px);"
    >
        I move based on scroll: {Math.round(scrollProgress * 100)}%
    </div>

    <!-- Bottom spacer for scrolling to bottom -->
    <div style="height: 800px;"></div>
</div>

<style>
    .scroll-container {
        min-height: 2000px;
        padding: 20px;
    }

    .fixed-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.9);
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
        z-index: 100;
    }

    h1 {
        margin-top: 60px;
        font-size: 24px;
        font-weight: bold;
    }

    .animated-box {
        width: 200px;
        height: 100px;
        background: #3b82f6;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin: 20px 0;
        padding: 10px;
        text-align: center;
    }
</style>
