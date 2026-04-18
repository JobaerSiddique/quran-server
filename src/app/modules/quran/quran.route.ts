import express from "express";
import rateLimit from "express-rate-limit";
import { QuranController } from "./quran.controller";

const router = express.Router();

// Specific rate limiters
const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: {
    success: false,
    message: "Too many search requests. Please try again after 5 minutes.",
  },
});

const seedLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1,
  message: {
    success: false,
    message: "Seeding can only be done once per hour",
  },
});

// Public routes
router.get("/surahs", QuranController.getAllSurahs);
router.get("/surah/:id", QuranController.getSingleSurah);
router.get("/ayah/:surahId/:ayahId", QuranController.getSingleAyah);
// router.get("/search", searchLimiter, QuranController.searchAyahs);
router.get("/search", searchLimiter, (req, res, next) => {
  // Handle both GET and POST for search
  QuranController.searchAyahs(req, res, next);
});
router.get("/juz/:juzNumber", QuranController.getAyahsByJuz);
router.get("/page/:pageNumber", QuranController.getAyahsByPage);
router.get("/stats", QuranController.getQuranStats);

// Admin/Seed route (protect with auth in production)
router.post("/seed", seedLimiter, QuranController.seedQuran);

export const quranRoutes = router;
