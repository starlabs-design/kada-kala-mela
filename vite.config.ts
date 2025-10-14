import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0", "5667e92a-6edf-4e0f-8ec5-9a71936af8c4-00-35sa0piqsfv8m.kirk.replit.dev", "a1910152-d8c7-411e-bb7e-f2d95c4f554b-00-3hbmet727tpfb.worf.replit.dev"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
