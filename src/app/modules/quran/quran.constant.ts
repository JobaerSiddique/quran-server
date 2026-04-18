import config from "../../config";

export const quranSearchableFields = ["textEnglish", "textArabic"];
export const surahFilterableFields = ["revelationType", "surahNumber"];
export const ayahFilterableFields = ["surahNumber", "juz", "page"];

export const QURAN_API_BASE_URL = config.QURAN_API_BASE_URL;
export const DEFAULT_TRANSLATION = config.DEFAULT_TRANSLATION;
