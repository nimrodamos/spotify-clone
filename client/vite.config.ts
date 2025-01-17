import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "./certs/localhost-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "./certs/localhost-cert.pem")
      ),
    },
    host: "localhost",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Map "@" to the "src" directory
    },
  },
});
