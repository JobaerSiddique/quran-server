import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

const main = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("✅ MongoDB connected successfully");

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📚 Quran API is ready at http://localhost:${config.port}`);
      console.log(`🔧 Environment: ${config.NODE_ENV || "development"}`);
    });
  } catch (error) {
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
