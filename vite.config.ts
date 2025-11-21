import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "host_app",
        remotes: {
          remote_app: env.VITE_REMOTE_URL,
        },
        shared: ["react", "react-dom"],
      }),
    ],
    server: {
      port: 5000,
      cors: true,
      hmr: false,
      strictPort: true,
    },
    preview: {
      port: 5000,
      cors: true,
    },
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
