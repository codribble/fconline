import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/fconline/",
  /* server: {
    proxy: {
      "/fconline": {
        target: "https://codribble.github.io/fconline",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fconline/, ""),
      },
    },
  }, */
});
