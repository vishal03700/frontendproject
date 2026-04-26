import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: "automatic",
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },
});
