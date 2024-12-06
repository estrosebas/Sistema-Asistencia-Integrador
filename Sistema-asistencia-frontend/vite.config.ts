import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build", // Aquí se establece el nombre de la carpeta
  },

  plugins: [react()],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
});
