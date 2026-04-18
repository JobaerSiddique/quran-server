"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quranRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const quran_controller_1 = require("./quran.controller");
const router = express_1.default.Router();
// Specific rate limiters
const searchLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30,
    message: {
        success: false,
        message: "Too many search requests. Please try again after 5 minutes.",
    },
});
const seedLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1,
    message: {
        success: false,
        message: "Seeding can only be done once per hour",
    },
});
// Public routes
router.get("/surahs", quran_controller_1.QuranController.getAllSurahs);
router.get("/surah/:id", quran_controller_1.QuranController.getSingleSurah);
router.get("/ayah/:surahId/:ayahId", quran_controller_1.QuranController.getSingleAyah);
// router.get("/search", searchLimiter, QuranController.searchAyahs);
router.get("/search", searchLimiter, (req, res, next) => {
    // Handle both GET and POST for search
    quran_controller_1.QuranController.searchAyahs(req, res, next);
});
router.get("/juz/:juzNumber", quran_controller_1.QuranController.getAyahsByJuz);
router.get("/page/:pageNumber", quran_controller_1.QuranController.getAyahsByPage);
router.get("/stats", quran_controller_1.QuranController.getQuranStats);
// Admin/Seed route (protect with auth in production)
router.post("/seed", seedLimiter, quran_controller_1.QuranController.seedQuran);
exports.quranRoutes = router;
