import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

// Custom plugin to force OXC to process JSX inside plain .js files
const transformJsxInJs = () => ({
  name: "transform-jsx-in-js",
  enforce: "pre", // Runs before the main React plugin pipeline
  async transform(code, id) {
    // Target only .js files in your source directory
    if (!id.match(/.*\.js$/)) {
      return null;
    }

    return await transformWithOxc(code, id, {
      lang: "jsx", // Explicitly instruct OXC to use the JSX parser
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    transformJsxInJs(), // Add the plugin here
  ],
});
