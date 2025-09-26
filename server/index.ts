import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedMockData } from "./seed-data";

dotenv.config(); // load .env variables

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ----------------------------
// Session middleware
// ----------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySuperSecretKey123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS me true, dev me false
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ----------------------------
// API logging middleware
// ----------------------------
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// ----------------------------
// Main async bootstrap
// ----------------------------
(async () => {
  const server = await registerRoutes(app);

  // Seed mock data in development
  if (app.get("env") === "development") {
    await seedMockData();
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Dev only: Vite middleware
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production: serve built frontend
    serveStatic(app);
  }

  // ----------------------------
  // Start server
  // ----------------------------
  const PORT = parseInt(process.env.PORT || "5002", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
})();
