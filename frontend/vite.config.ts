import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-dom/client"], // 👈 this line is the fix!
  },
  ssr: {
    noExternal: ['@react-three/fiber', '@react-three/drei'],
  },  
});
