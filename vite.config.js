import { defineConfig } from "vite";
import { resolve } from "path";

// Vite Plugin to mock Vercel Serverless Functions during local dev
function vercelApiMock() {
  return {
    name: "vercel-api-mock",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", async () => {
            try {
              req.body = JSON.parse(body);

              // Dynamically import only during local runtime, preventing Vercel build crashes
              const dotenv = await import("dotenv");
              const { default: handler } = await import("./api/contact.js");
              dotenv.config({ path: resolve(process.cwd(), ".env") });

              // Mock Vercel res methods
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
              };

              await handler(req, res);
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: "Server error" }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [vercelApiMock()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
