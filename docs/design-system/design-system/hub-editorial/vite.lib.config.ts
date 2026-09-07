import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "lib",
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "HubEditorial",
      formats: ["es"],
      fileName: "hub-editorial-studio",
      cssFileName: "hub-editorial-studio",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "lucide-react"],
    },
  },
});
