import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import config from "./app/config";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import router from "./app/routes";

const app = express();

// ========== SECURITY MIDDLEWARE ==========

// Helmet - Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
const corsOptions = {
  origin: config.frontend_url || [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // 10 minutes
};
app.use(cors(corsOptions));

// Rate limiting - Prevent DDOS and brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
  skipFailedRequests: false, // Count failed requests
});

// Apply rate limiting to API routes
app.use("/api/v1", limiter);

// Stricter rate limit for search endpoints
const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes
  message: {
    success: false,
    message: "Too many search requests, please try again after 5 minutes",
  },
});
app.use("/api/v1/search", searchLimiter);

// Logging with Morgan
const morganFormat = config.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        console.log(message.trim());
      },
    },
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint (no rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// API routes
app.use("/api/v1", router);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Quran API is running",
    version: "1.0.0",
    endpoints: {
      surahs: "/api/v1/quran/surahs",
      surah: "/api/v1/quran/surah/:id",
      search: "/api/v1/quran/search?q=keyword",
      seed: "/api/v1/quran/seed (POST)",
    },
    documentation: "/api/v1/docs",
  });
});

// Error handling middleware (should be last)
app.use(globalErrorHandler);
// app.use(notFound);

export default app;
