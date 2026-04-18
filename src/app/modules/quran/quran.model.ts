import mongoose, { Schema, model } from "mongoose";
import { IAyah, ISurah } from "./quran.interface";

// Surah Schema
const SurahSchema = new Schema<ISurah>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Ayah Schema
const AyahSchema = new Schema<IAyah>(
  {
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
  },
  {
    timestamps: true,
  },
);

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

export const Surah = model<ISurah>("Surah", SurahSchema);
export const Ayah = model<IAyah>("Ayah", AyahSchema);
