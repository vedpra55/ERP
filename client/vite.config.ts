import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils"),
      "@pages": resolve(__dirname, "src/pages"),
      "@pageComponents": resolve(__dirname, "src/pageComponents"),
      "@context": resolve(__dirname, "src/context"),
      "@api": resolve(__dirname, "src/api"),
      "@@types": resolve(__dirname, "src/@types"),
    },
  },
});
