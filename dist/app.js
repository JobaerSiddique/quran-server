"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("./app/config"));
const globalErrorhandler_1 = __importDefault(require("./app/middleware/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// ========== SECURITY MIDDLEWARE ==========
// Helmet - Security headers
app.use((0, helmet_1.default)({
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
}));
// CORS configuration
const corsOptions = {
    origin: config_1.default.frontend_url || [
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // 10 minutes
};
app.use((0, cors_1.default)(corsOptions));
// Rate limiting - Prevent DDOS and brute force attacks
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count successful requests
    skipFailedRequests: false, // Count failed requests
});
// Apply rate limiting to API routes
app.use("/api/v1", limiter);
// Stricter rate limit for search endpoints
const searchLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 requests per 5 minutes
    message: {
        success: false,
        message: "Too many search requests, please try again after 5 minutes",
    },
});
app.use("/api/v1/search", searchLimiter);
// Logging with Morgan
const morganFormat = config_1.default.NODE_ENV === "production" ? "combined" : "dev";
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            console.log(message.trim());
        },
    },
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
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
        environment: config_1.default.NODE_ENV,
    });
});
// API routes
app.use("/api/v1", routes_1.default);
// Root endpoint
app.get("/", (req, res) => {
    res.send("Hurry Quran server is running ");
});
// Error handling middleware (should be last)
app.use(globalErrorhandler_1.default);
// app.use(notFound);
exports.default = app;
