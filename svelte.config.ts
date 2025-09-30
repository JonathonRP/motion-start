import adapter from "@sveltejs/adapter-auto";
import { Config } from "@sveltejs/kit";

const config: Config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
  compilerOptions: {
    runes: false,
  },
};

export default config;
