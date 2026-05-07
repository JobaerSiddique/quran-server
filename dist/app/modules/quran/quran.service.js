"use strict";
// import mongoose from "mongoose";
// import httpStatus from "http-status";
// import axios from "axios";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranService = void 0;
// import { IAyah, ISurah, ISearchResult } from "./quran.interface";
// import {
//   quranSearchableFields,
//   QURAN_API_BASE_URL,
//   DEFAULT_TRANSLATION,
// } from "./quran.constant";
// import { Ayah, Surah } from "./quran.model";
// import AppError from "../../error/AppError";
// import QueryBuilder from "../../builder/QueryBuilder";
// // const seedQuranFromAPI = async () => {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();
// //   try {
// //     console.log("🌱 Starting Quran database seeding...");
// //     // Fetch all surahs
// //     const surahsResponse = await axios.get(`${QURAN_API_BASE_URL}/surah`);
// //     const surahs = surahsResponse.data.data;
// //     console.log(surahs);
// //     let totalAyahs = 0;
// //     for (const surah of surahs) {
// //       // Upsert surah
// //       const surahData: Partial<ISurah> = {
// //         surahNumber: surah.number,
// //         nameArabic: surah.name,
// //         nameEnglish: surah.englishName,
// //         nameTransliteration: surah.englishNameTranslation,
// //         totalAyahs: surah.numberOfAyahs,
// //         revelationType:
// //           surah.revelationType === "Meccan" ? "Meccan" : "Medinan",
// //         order: surah.number,
// //         isDeleted: false,
// //       };
// //       await Surah.findOneAndUpdate({ surahNumber: surah.number }, surahData, {
// //         upsert: true,
// //         session,
// //       });
// //       // Fetch ayahs for this surah
// //       const ayahsResponse = await axios.get(
// //         `${QURAN_API_BASE_URL}/surah/${surah.number}/editions/quran-uthmani,${DEFAULT_TRANSLATION}`,
// //       );
// //       const arabicEdition = ayahsResponse.data.data[0];
// //       const englishEdition = ayahsResponse.data.data[1];
// //       for (let i = 0; i < arabicEdition.ayahs.length; i++) {
// //         const ayahData: Partial<IAyah> = {
// //           surahNumber: surah.number,
// //           ayahNumber: arabicEdition.ayahs[i].numberInSurah,
// //           textArabic: arabicEdition.ayahs[i].text,
// //           textEnglish: englishEdition.ayahs[i].text,
// //           juz: Math.ceil(arabicEdition.ayahs[i].juz || 1),
// //           page: arabicEdition.ayahs[i].page || 1,
// //           sajda: false,
// //           isDeleted: false,
// //         };
// //         await Ayah.findOneAndUpdate(
// //           { surahNumber: surah.number, ayahNumber: ayahData.ayahNumber },
// //           ayahData,
// //           { upsert: true, session },
// //         );
// //         totalAyahs++;
// //       }
// //       console.log(
// //         `✅ Seeded Surah ${surah.number}: ${surah.englishName} (${surah.numberOfAyahs} ayahs)`,
// //       );
// //     }
// //     await session.commitTransaction();
// //     console.log(
// //       `🎉 Quran database seeding completed! Total: 114 Surahs, ${totalAyahs} Ayahs`,
// //     );
// //     return {
// //       success: true,
// //       message: "Quran database seeded successfully",
// //       data: { totalSurahs: surahs.length, totalAyahs },
// //     };
// //   } catch (error) {
// //     await session.abortTransaction();
// //     console.error("❌ Seeding error:", error);
// //     throw new AppError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Failed to seed Quran database",
// //     );
// //   } finally {
// //     session.endSession();
// //   }
// // };
// const seedQuranFromAPI = async () => {
//   try {
//     console.log("🌱 Starting Quran database seeding...");
//     // Fetch all surahs
//     const surahsResponse = await axios.get(`${QURAN_API_BASE_URL}/surah`);
//     const surahs = surahsResponse.data.data;
//     let totalAyahs = 0;
//     let successCount = 0;
//     let errorCount = 0;
//     for (const surah of surahs) {
//       try {
//         // Upsert surah without transaction
//         const surahData: Partial<ISurah> = {
//           surahNumber: surah.number,
//           nameArabic: surah.name,
//           nameEnglish: surah.englishName,
//           nameTransliteration: surah.englishNameTranslation,
//           totalAyahs: surah.numberOfAyahs,
//           revelationType:
//             surah.revelationType === "Meccan" ? "Meccan" : "Medinan",
//           order: surah.number,
//           isDeleted: false,
//         };
//         await Surah.findOneAndUpdate({ surahNumber: surah.number }, surahData, {
//           upsert: true,
//         });
//         // Fetch ayahs for this surah
//         const ayahsResponse = await axios.get(
//           `${QURAN_API_BASE_URL}/surah/${surah.number}/editions/quran-uthmani,${DEFAULT_TRANSLATION}`,
//           { timeout: 30000 }, // 30 second timeout
//         );
//         const arabicEdition = ayahsResponse.data.data[0];
//         const englishEdition = ayahsResponse.data.data[1];
//         if (!arabicEdition || !englishEdition) {
//           console.error(`❌ Missing edition data for surah ${surah.number}`);
//           errorCount++;
//           continue;
//         }
//         for (let i = 0; i < arabicEdition.ayahs.length; i++) {
//           const ayahData: Partial<IAyah> = {
//             surahNumber: surah.number,
//             ayahNumber: arabicEdition.ayahs[i].numberInSurah,
//             textArabic: arabicEdition.ayahs[i].text,
//             textEnglish: englishEdition.ayahs[i]?.text || "",
//             juz:
//               arabicEdition.ayahs[i].juz ||
//               Math.ceil(arabicEdition.ayahs[i].numberInSurah / 20),
//             page: arabicEdition.ayahs[i].page || 1,
//             sajda: false,
//             isDeleted: false,
//           };
//           await Ayah.findOneAndUpdate(
//             { surahNumber: surah.number, ayahNumber: ayahData.ayahNumber },
//             ayahData,
//             { upsert: true },
//           );
//           totalAyahs++;
//         }
//         successCount++;
//         console.log(
//           `✅ Seeded Surah ${surah.number}: ${surah.englishName} (${surah.numberOfAyahs} ayahs)`,
//         );
//       } catch (surahError) {
//         errorCount++;
//         console.error(`❌ Failed to seed surah ${surah.number}:`);
//         // Continue with next surah instead of failing completely
//       }
//     }
//     console.log(
//       `🎉 Quran database seeding completed! Success: ${successCount}/114 Surahs, Total: ${totalAyahs} Ayahs, Errors: ${errorCount}`,
//     );
//     return {
//       success: true,
//       message: "Quran database seeded successfully",
//       data: {
//         totalSurahs: successCount,
//         totalAyahs,
//         errors: errorCount,
//       },
//     };
//   } catch (error) {
//     console.error("❌ Seeding error:", error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to seed Quran database",
//     );
//   }
// };
// // const getAllSurahsFromDB = async (query: Record<string, unknown>) => {
// //   try {
// //     const baseQuery = Surah.find({ isDeleted: false });
// //     const surahQuery = new QueryBuilder(baseQuery, query)
// //       .search(["nameEnglish", "nameArabic", "nameTransliteration"])
// //       .filter()
// //       .sort()
// //       .fields()
// //       .paginate();
// //     const [result, total] = await Promise.all([
// //       surahQuery.modelQuery.exec(),
// //       Surah.countDocuments(surahQuery.modelQuery.getFilter()),
// //     ]);
// //     const limit = Math.max(1, Math.min(Number(query.limit) || 114, 114));
// //     const page = Math.max(1, Number(query.page) || 1);
// //     const totalPage = Math.ceil(total / limit);
// //     return {
// //       meta: {
// //         page,
// //         limit,
// //         total,
// //         totalPage,
// //       },
// //       data: result,
// //     };
// //   } catch (error) {
// //     throw new AppError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Failed to retrieve surahs",
// //     );
// //   }
// // };
// const getAllSurahsFromDB = async (query: Record<string, unknown>) => {
//   try {
//     // Add default sort by surahNumber if no sort is specified
//     if (!query.sort) {
//       query.sort = "surahNumber";
//     }
//     const baseQuery = Surah.find({ isDeleted: false });
//     const surahQuery = new QueryBuilder(baseQuery, query)
//       .search(["nameEnglish", "nameArabic", "nameTransliteration"])
//       .filter()
//       .sort() // This will use 'surahNumber' as default
//       .fields()
//       .paginate();
//     const [result, total] = await Promise.all([
//       surahQuery.modelQuery.exec(),
//       Surah.countDocuments(surahQuery.modelQuery.getFilter()),
//     ]);
//     const limit = Math.max(1, Math.min(Number(query.limit) || 114, 114));
//     const page = Math.max(1, Number(query.page) || 1);
//     const totalPage = Math.ceil(total / limit);
//     return {
//       meta: {
//         page,
//         limit,
//         total,
//         totalPage,
//       },
//       data: result, // This will have surah 1 first, then 2, 3... 114
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to retrieve surahs",
//     );
//   }
// };
// const getSingleSurahFromDB = async (surahNumber: number) => {
//   // Check if surah exists
//   const surah = await Surah.findOne({ surahNumber, isDeleted: false });
//   if (!surah) {
//     throw new AppError(httpStatus.NOT_FOUND, "Surah not found");
//   }
//   // Get all ayahs for this surah
//   const ayahs = await Ayah.find({ surahNumber, isDeleted: false }).sort({
//     ayahNumber: 1,
//   });
//   if (!ayahs || ayahs.length === 0) {
//     throw new AppError(httpStatus.NOT_FOUND, "Ayahs not found for this surah");
//   }
//   return {
//     surah,
//     ayahs,
//     totalAyahs: ayahs.length,
//   };
// };
// const getSingleAyahFromDB = async (surahNumber: number, ayahNumber: number) => {
//   const ayah = await Ayah.findOne({
//     surahNumber,
//     ayahNumber,
//     isDeleted: false,
//   }).populate("surah");
//   if (!ayah) {
//     throw new AppError(httpStatus.NOT_FOUND, "Ayah not found");
//   }
//   return ayah;
// };
// // const searchAyahsInDB = async (
// //   searchTerm: string,
// //   query: Record<string, unknown>,
// // ) => {
// //   if (!searchTerm || searchTerm.trim().length === 0) {
// //     throw new AppError(httpStatus.BAD_REQUEST, "Search term is required");
// //   }
// //   try {
// //     // Use text search for better results
// //     const searchRegex = new RegExp(searchTerm, "i");
// //     console.log(searchRegex);
// //     const baseQuery = Ayah.find({
// //       isDeleted: false,
// //       $or: [{ textEnglish: searchRegex }, { textArabic: searchRegex }],
// //     }).populate("surah");
// //     const ayahQuery = new QueryBuilder(baseQuery, query)
// //       .filter()
// //       .sort()
// //       .fields()
// //       .paginate();
// //     const [result, total] = await Promise.all([
// //       ayahQuery.modelQuery.limit(50).exec(), // Limit to 50 results for performance
// //       Ayah.countDocuments(ayahQuery.modelQuery.getFilter()),
// //     ]);
// //     // Enhance results with surah info
// //     const enhancedResults = await Promise.all(
// //       result.map(async (ayah) => {
// //         const surah = await Surah.findOne({ surahNumber: ayah.surahNumber });
// //         return {
// //           ...ayah.toObject(),
// //           surahInfo: surah,
// //         };
// //       }),
// //     );
// //     const limit = Math.max(1, Math.min(Number(query.limit) || 20, 50));
// //     const page = Math.max(1, Number(query.page) || 1);
// //     const totalPage = Math.ceil(total / limit);
// //     return {
// //       meta: {
// //         page,
// //         limit,
// //         total,
// //         totalPage,
// //         searchTerm,
// //       },
// //       data: enhancedResults,
// //     };
// //   } catch (error) {
// //     throw new AppError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Failed to search ayahs",
// //     );
// //   }
// // };
// const searchAyahsInDB = async (searchTerm: string) => {
//   const clean = searchTerm.trim();
//   const filter = {
//     isDeleted: false,
//     $text: { $search: clean },
//   };
//   let result = await Ayah.find(filter, {
//     score: { $meta: "textScore" },
//   })
//     .populate("surah")
//     .sort({ score: { $meta: "textScore" } })
//     .limit(20);
//   if (result.length === 0) {
//     const regex = new RegExp(clean, "i");
//     result = await Ayah.find({
//       isDeleted: false,
//       textEnglish: regex,
//     })
//       .populate("surah")
//       .limit(20);
//   }
//   return {
//     meta: {
//       total: result.length,
//       searchTerm: clean,
//     },
//     data: result,
//   };
// };
// const getAyahsByJuzFromDB = async (
//   juzNumber: number,
//   query: Record<string, unknown>,
// ) => {
//   try {
//     const baseQuery = Ayah.find({ juz: juzNumber, isDeleted: false })
//       .populate("surah")
//       .sort({ surahNumber: 1, ayahNumber: 1 });
//     const ayahQuery = new QueryBuilder(baseQuery, query)
//       .filter()
//       .fields()
//       .paginate();
//     const [result, total] = await Promise.all([
//       ayahQuery.modelQuery.exec(),
//       Ayah.countDocuments(ayahQuery.modelQuery.getFilter()),
//     ]);
//     const limit = Math.max(1, Math.min(Number(query.limit) || 100, 200));
//     const page = Math.max(1, Number(query.page) || 1);
//     const totalPage = Math.ceil(total / limit);
//     return {
//       meta: {
//         page,
//         limit,
//         total,
//         totalPage,
//         juz: juzNumber,
//       },
//       data: result,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to retrieve ayahs by juz",
//     );
//   }
// };
// const getAyahsByPageFromDB = async (pageNumber: number) => {
//   try {
//     const ayahs = await Ayah.find({ page: pageNumber, isDeleted: false })
//       .populate("surah")
//       .sort({ surahNumber: 1, ayahNumber: 1 });
//     if (!ayahs || ayahs.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, "Page not found");
//     }
//     return {
//       page: pageNumber,
//       totalAyahs: ayahs.length,
//       ayahs,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to retrieve ayahs by page",
//     );
//   }
// };
// const getSurahStatsFromDB = async () => {
//   try {
//     const totalSurahs = await Surah.countDocuments({ isDeleted: false });
//     const totalAyahs = await Ayah.countDocuments({ isDeleted: false });
//     const meccanSurahs = await Surah.countDocuments({
//       revelationType: "Meccan",
//       isDeleted: false,
//     });
//     const medinanSurahs = await Surah.countDocuments({
//       revelationType: "Medinan",
//       isDeleted: false,
//     });
//     // Get longest surah
//     const longestSurah = await Surah.findOne({ isDeleted: false })
//       .sort({ totalAyahs: -1 })
//       .limit(1);
//     // Get shortest surah
//     const shortestSurah = await Surah.findOne({ isDeleted: false })
//       .sort({ totalAyahs: 1 })
//       .limit(1);
//     return {
//       totalSurahs,
//       totalAyahs,
//       meccanSurahs,
//       medinanSurahs,
//       longestSurah: longestSurah
//         ? {
//             name: longestSurah.nameEnglish,
//             ayahs: longestSurah.totalAyahs,
//           }
//         : null,
//       shortestSurah: shortestSurah
//         ? {
//             name: shortestSurah.nameEnglish,
//             ayahs: shortestSurah.totalAyahs,
//           }
//         : null,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to retrieve Quran statistics",
//     );
//   }
// };
// export const QuranService = {
//   seedQuranFromAPI,
//   getAllSurahsFromDB,
//   getSingleSurahFromDB,
//   getSingleAyahFromDB,
//   searchAyahsInDB,
//   getAyahsByJuzFromDB,
//   getAyahsByPageFromDB,
//   getSurahStatsFromDB,
// };
// quran.service.ts
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const quran_constant_1 = require("./quran.constant");
const quran_model_1 = require("./quran.model");
const generateAudioUrl = (surahNumber, ayahNumber) => {
    const surah = surahNumber.toString().padStart(3, "0");
    const ayah = ayahNumber.toString().padStart(3, "0");
    return `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3`;
};
const generateFullSurahAudio = (surahNumber) => {
    return `https://server8.mp3quran.net/afs/${surahNumber
        .toString()
        .padStart(3, "0")}.mp3`;
};
const seedQuranFromAPI = async () => {
    try {
        console.log("🌱 Starting Quran database seeding...");
        const surahsResponse = await axios_1.default.get(`${quran_constant_1.QURAN_API_BASE_URL}/surah`);
        const surahs = surahsResponse.data.data;
        let totalAyahs = 0;
        let successCount = 0;
        let errorCount = 0;
        for (const surah of surahs) {
            try {
                await quran_model_1.Surah.findOneAndUpdate({
                    surahNumber: surah.number,
                }, {
                    surahNumber: surah.number,
                    nameArabic: surah.name,
                    nameEnglish: surah.englishName,
                    nameTransliteration: surah.englishNameTranslation,
                    totalAyahs: surah.numberOfAyahs,
                    revelationType: surah.revelationType === "Meccan" ? "Meccan" : "Medinan",
                    order: surah.number,
                    isDeleted: false,
                }, {
                    upsert: true,
                });
                const ayahsResponse = await axios_1.default.get(`${quran_constant_1.QURAN_API_BASE_URL}/surah/${surah.number}/editions/quran-uthmani,${quran_constant_1.DEFAULT_TRANSLATION}`);
                const arabicEdition = ayahsResponse.data.data[0];
                const englishEdition = ayahsResponse.data.data[1];
                for (let i = 0; i < arabicEdition.ayahs.length; i++) {
                    const arabicAyah = arabicEdition.ayahs[i];
                    const englishAyah = englishEdition.ayahs[i];
                    await quran_model_1.Ayah.findOneAndUpdate({
                        surahNumber: surah.number,
                        ayahNumber: arabicAyah.numberInSurah,
                    }, {
                        surahNumber: surah.number,
                        ayahNumber: arabicAyah.numberInSurah,
                        textArabic: arabicAyah.text,
                        textEnglish: englishAyah?.text || "",
                        juz: arabicAyah.juz || 1,
                        page: arabicAyah.page || 1,
                        sajda: false,
                        isDeleted: false,
                    }, {
                        upsert: true,
                    });
                    totalAyahs++;
                }
                successCount++;
                console.log(`✅ Seeded Surah ${surah.number}`);
            }
            catch (error) {
                errorCount++;
                console.log(`❌ Failed Surah ${surah.number}`);
            }
        }
        return {
            totalSurahs: successCount,
            totalAyahs,
            errors: errorCount,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to seed Quran database");
    }
};
const getAllSurahsFromDB = async (query) => {
    try {
        const limit = Math.max(1, Math.min(Number(query.limit) || 114, 114));
        const page = Math.max(1, Number(query.page) || 1);
        const skip = (page - 1) * limit;
        const searchTerm = query.search;
        const filter = {
            isDeleted: false,
        };
        if (searchTerm) {
            filter.$or = [
                {
                    nameEnglish: {
                        $regex: searchTerm,
                        $options: "i",
                    },
                },
                {
                    nameArabic: {
                        $regex: searchTerm,
                        $options: "i",
                    },
                },
            ];
        }
        const [surahs, total] = await Promise.all([
            quran_model_1.Surah.find(filter)
                .sort({ surahNumber: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            quran_model_1.Surah.countDocuments(filter),
        ]);
        return {
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
            data: surahs,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve surahs");
    }
};
const getSingleSurahFromDB = async (surahNumber) => {
    const surah = await quran_model_1.Surah.findOne({
        surahNumber,
        isDeleted: false,
    })
        .lean()
        .select("-__v");
    if (!surah) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Surah not found");
    }
    const ayahs = await quran_model_1.Ayah.find({
        surahNumber,
        isDeleted: false,
    })
        .sort({
        ayahNumber: 1,
    })
        .lean()
        .select("-__v");
    const formattedAyahs = ayahs.map((ayah) => ({
        ...ayah,
        audioUrl: generateAudioUrl(ayah.surahNumber, ayah.ayahNumber),
    }));
    return {
        surah,
        totalAyahs: formattedAyahs.length,
        fullAudioUrl: generateFullSurahAudio(surahNumber),
        ayahs: formattedAyahs,
    };
};
const getSingleAyahFromDB = async (surahNumber, ayahNumber) => {
    const ayah = await quran_model_1.Ayah.findOne({
        surahNumber,
        ayahNumber,
        isDeleted: false,
    })
        .populate("surah")
        .lean();
    if (!ayah) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Ayah not found");
    }
    return {
        ...ayah,
        audioUrl: generateAudioUrl(surahNumber, ayahNumber),
    };
};
const searchAyahsInDB = async (searchTerm) => {
    const clean = searchTerm.trim();
    let result = await quran_model_1.Ayah.find({
        isDeleted: false,
        $text: {
            $search: clean,
        },
    }, {
        score: {
            $meta: "textScore",
        },
    })
        .populate("surah")
        .sort({
        score: {
            $meta: "textScore",
        },
    })
        .limit(30)
        .lean();
    if (result.length === 0) {
        const regex = new RegExp(clean, "i");
        result = await quran_model_1.Ayah.find({
            isDeleted: false,
            $or: [
                {
                    textEnglish: regex,
                },
                {
                    textArabic: regex,
                },
            ],
        })
            .populate("surah")
            .limit(30)
            .lean();
    }
    const formatted = result.map((ayah) => ({
        ...ayah,
        audioUrl: generateAudioUrl(ayah.surahNumber, ayah.ayahNumber),
    }));
    return {
        meta: {
            total: formatted.length,
            searchTerm: clean,
        },
        data: formatted,
    };
};
const getAyahsByJuzFromDB = async (juzNumber, query) => {
    try {
        const limit = Math.max(1, Math.min(Number(query.limit) || 100, 200));
        const page = Math.max(1, Number(query.page) || 1);
        const skip = (page - 1) * limit;
        const filter = {
            juz: juzNumber,
            isDeleted: false,
        };
        const [ayahs, total] = await Promise.all([
            quran_model_1.Ayah.find(filter)
                .populate("surah")
                .sort({
                surahNumber: 1,
                ayahNumber: 1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            quran_model_1.Ayah.countDocuments(filter),
        ]);
        const formattedAyahs = ayahs.map((ayah) => ({
            ...ayah,
            audioUrl: generateAudioUrl(ayah.surahNumber, ayah.ayahNumber),
        }));
        return {
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
            data: formattedAyahs,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve ayahs by juz");
    }
};
const getAyahsByPageFromDB = async (pageNumber) => {
    try {
        const ayahs = await quran_model_1.Ayah.find({
            page: pageNumber,
            isDeleted: false,
        })
            .populate("surah")
            .sort({
            surahNumber: 1,
            ayahNumber: 1,
        })
            .lean();
        if (!ayahs.length) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Page not found");
        }
        const formattedAyahs = ayahs.map((ayah) => ({
            ...ayah,
            audioUrl: generateAudioUrl(ayah.surahNumber, ayah.ayahNumber),
        }));
        return {
            page: pageNumber,
            totalAyahs: formattedAyahs.length,
            ayahs: formattedAyahs,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve ayahs by page");
    }
};
const getSurahStatsFromDB = async () => {
    try {
        const totalSurahs = await quran_model_1.Surah.countDocuments({
            isDeleted: false,
        });
        const totalAyahs = await quran_model_1.Ayah.countDocuments({
            isDeleted: false,
        });
        const meccanSurahs = await quran_model_1.Surah.countDocuments({
            revelationType: "Meccan",
            isDeleted: false,
        });
        const medinanSurahs = await quran_model_1.Surah.countDocuments({
            revelationType: "Medinan",
            isDeleted: false,
        });
        const longestSurah = await quran_model_1.Surah.findOne({
            isDeleted: false,
        })
            .sort({
            totalAyahs: -1,
        })
            .lean();
        const shortestSurah = await quran_model_1.Surah.findOne({
            isDeleted: false,
        })
            .sort({
            totalAyahs: 1,
        })
            .lean();
        return {
            totalSurahs,
            totalAyahs,
            meccanSurahs,
            medinanSurahs,
            longestSurah: longestSurah
                ? {
                    name: longestSurah.nameEnglish,
                    ayahs: longestSurah.totalAyahs,
                }
                : null,
            shortestSurah: shortestSurah
                ? {
                    name: shortestSurah.nameEnglish,
                    ayahs: shortestSurah.totalAyahs,
                }
                : null,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve Quran statistics");
    }
};
exports.QuranService = {
    seedQuranFromAPI,
    getAllSurahsFromDB,
    getSingleSurahFromDB,
    getSingleAyahFromDB,
    searchAyahsInDB,
    getAyahsByJuzFromDB,
    getAyahsByPageFromDB,
    getSurahStatsFromDB,
};
