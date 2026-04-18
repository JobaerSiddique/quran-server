"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ayah = exports.Surah = void 0;
const mongoose_1 = require("mongoose");
// Surah Schema
const SurahSchema = new mongoose_1.Schema({
    surahNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    nameArabic: {
        type: String,
        required: true,
    },
    nameEnglish: {
        type: String,
        required: true,
    },
    nameTransliteration: {
        type: String,
        required: true,
    },
    totalAyahs: {
        type: Number,
        required: true,
    },
    revelationType: {
        type: String,
        enum: ["Meccan", "Medinan"],
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Ayah Schema
const AyahSchema = new mongoose_1.Schema({
    surahNumber: {
        type: Number,
        required: true,
        index: true,
    },
    ayahNumber: {
        type: Number,
        required: true,
    },
    textArabic: {
        type: String,
        required: true,
    },
    textEnglish: {
        type: String,
        required: true,
    },
    juz: {
        type: Number,
        required: true,
    },
    page: {
        type: Number,
        required: true,
        index: true,
    },
    sajda: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Compound index for unique ayah
AyahSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });
// Text index for search
AyahSchema.index({ textEnglish: "text" });
// Virtual for surah reference
AyahSchema.virtual("surah", {
    ref: "Surah",
    localField: "surahNumber",
    foreignField: "surahNumber",
    justOne: true,
});
exports.Surah = (0, mongoose_1.model)("Surah", SurahSchema);
exports.Ayah = (0, mongoose_1.model)("Ayah", AyahSchema);
