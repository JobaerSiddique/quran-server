"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const main = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log("✅ MongoDB connected successfully");
        app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Server is running on port ${config_1.default.port}`);
            console.log(`📚 Quran API is ready at http://localhost:${config_1.default.port}`);
            console.log(`🔧 Environment: ${config_1.default.NODE_ENV || "development"}`);
        });
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
main();
