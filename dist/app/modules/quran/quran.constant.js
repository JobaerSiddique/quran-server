"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TRANSLATION = exports.QURAN_API_BASE_URL = exports.ayahFilterableFields = exports.surahFilterableFields = exports.quranSearchableFields = void 0;
const config_1 = __importDefault(require("../../config"));
exports.quranSearchableFields = ["textEnglish", "textArabic"];
exports.surahFilterableFields = ["revelationType", "surahNumber"];
exports.ayahFilterableFields = ["surahNumber", "juz", "page"];
exports.QURAN_API_BASE_URL = config_1.default.QURAN_API_BASE_URL;
exports.DEFAULT_TRANSLATION = config_1.default.DEFAULT_TRANSLATION;
