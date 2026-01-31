import type { Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, type ViteDevServer } from "vite";

const viteLogger = {
  info: (msg: string) => console.log(msg),
  warn: (msg: string) => console.warn(msg),
  warnOnce: (msg: string) => console.warn(msg),
  error: (msg: string) => console.error(msg),
  clearScreen: () => {},
  hasErrorLogged: () => false,
  hasWarned: false,
};

export async function setupVite(app: Express): Promise<ViteDevServer> {
  const serverOptions = {
    middlewareMode: true,
    hmr: { overlay: false },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    customLogger: viteLogger,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      if (url.startsWith("/api") || url.startsWith("/uploads")) {
        return next();
      }

      const clientTemplate = path.resolve(process.cwd(), "index.html");
      let template = fs.readFileSync(clientTemplate, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 
        "Content-Type": "text/html",
        "Cache-Control": "no-cache"
      }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return vite;
}
