import mongoose from "mongoose";
import httpStatus from "http-status";
import axios from "axios";

import { IAyah, ISurah, ISearchResult } from "./quran.interface";

import {
  quranSearchableFields,
  QURAN_API_BASE_URL,
  DEFAULT_TRANSLATION,
} from "./quran.constant";
import { Ayah, Surah } from "./quran.model";
import AppError from "../../error/AppError";
import QueryBuilder from "../../builder/QueryBuilder";

// const seedQuranFromAPI = async () => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log("🌱 Starting Quran database seeding...");

//     // Fetch all surahs
//     const surahsResponse = await axios.get(`${QURAN_API_BASE_URL}/surah`);

//     const surahs = surahsResponse.data.data;
//     console.log(surahs);
//     let totalAyahs = 0;

//     for (const surah of surahs) {
//       // Upsert surah
//       const surahData: Partial<ISurah> = {
//         surahNumber: surah.number,
//         nameArabic: surah.name,
//         nameEnglish: surah.englishName,
//         nameTransliteration: surah.englishNameTranslation,
//         totalAyahs: surah.numberOfAyahs,
//         revelationType:
//           surah.revelationType === "Meccan" ? "Meccan" : "Medinan",
//         order: surah.number,
//         isDeleted: false,
//       };

//       await Surah.findOneAndUpdate({ surahNumber: surah.number }, surahData, {
//         upsert: true,
//         session,
//       });

//       // Fetch ayahs for this surah
//       const ayahsResponse = await axios.get(
//         `${QURAN_API_BASE_URL}/surah/${surah.number}/editions/quran-uthmani,${DEFAULT_TRANSLATION}`,
//       );

//       const arabicEdition = ayahsResponse.data.data[0];
//       const englishEdition = ayahsResponse.data.data[1];

//       for (let i = 0; i < arabicEdition.ayahs.length; i++) {
//         const ayahData: Partial<IAyah> = {
//           surahNumber: surah.number,
//           ayahNumber: arabicEdition.ayahs[i].numberInSurah,
//           textArabic: arabicEdition.ayahs[i].text,
//           textEnglish: englishEdition.ayahs[i].text,
//           juz: Math.ceil(arabicEdition.ayahs[i].juz || 1),
//           page: arabicEdition.ayahs[i].page || 1,
//           sajda: false,
//           isDeleted: false,
//         };

//         await Ayah.findOneAndUpdate(
//           { surahNumber: surah.number, ayahNumber: ayahData.ayahNumber },
//           ayahData,
//           { upsert: true, session },
//         );

//         totalAyahs++;
//       }

//       console.log(
//         `✅ Seeded Surah ${surah.number}: ${surah.englishName} (${surah.numberOfAyahs} ayahs)`,
//       );
//     }

//     await session.commitTransaction();
//     console.log(
//       `🎉 Quran database seeding completed! Total: 114 Surahs, ${totalAyahs} Ayahs`,
//     );

//     return {
//       success: true,
//       message: "Quran database seeded successfully",
//       data: { totalSurahs: surahs.length, totalAyahs },
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("❌ Seeding error:", error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to seed Quran database",
//     );
//   } finally {
//     session.endSession();
//   }
// };

const seedQuranFromAPI = async () => {
  try {
    console.log("🌱 Starting Quran database seeding...");

    // Fetch all surahs
    const surahsResponse = await axios.get(`${QURAN_API_BASE_URL}/surah`);
    const surahs = surahsResponse.data.data;
    let totalAyahs = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const surah of surahs) {
      try {
        // Upsert surah without transaction
        const surahData: Partial<ISurah> = {
          surahNumber: surah.number,
          nameArabic: surah.name,
          nameEnglish: surah.englishName,
          nameTransliteration: surah.englishNameTranslation,
          totalAyahs: surah.numberOfAyahs,
          revelationType:
            surah.revelationType === "Meccan" ? "Meccan" : "Medinan",
          order: surah.number,
          isDeleted: false,
        };

        await Surah.findOneAndUpdate({ surahNumber: surah.number }, surahData, {
          upsert: true,
        });

        // Fetch ayahs for this surah
        const ayahsResponse = await axios.get(
          `${QURAN_API_BASE_URL}/surah/${surah.number}/editions/quran-uthmani,${DEFAULT_TRANSLATION}`,
          { timeout: 30000 }, // 30 second timeout
        );

        const arabicEdition = ayahsResponse.data.data[0];
        const englishEdition = ayahsResponse.data.data[1];

        if (!arabicEdition || !englishEdition) {
          console.error(`❌ Missing edition data for surah ${surah.number}`);
          errorCount++;
          continue;
        }

        for (let i = 0; i < arabicEdition.ayahs.length; i++) {
          const ayahData: Partial<IAyah> = {
            surahNumber: surah.number,
            ayahNumber: arabicEdition.ayahs[i].numberInSurah,
            textArabic: arabicEdition.ayahs[i].text,
            textEnglish: englishEdition.ayahs[i]?.text || "",
            juz:
              arabicEdition.ayahs[i].juz ||
              Math.ceil(arabicEdition.ayahs[i].numberInSurah / 20),
            page: arabicEdition.ayahs[i].page || 1,
            sajda: false,
            isDeleted: false,
          };

          await Ayah.findOneAndUpdate(
            { surahNumber: surah.number, ayahNumber: ayahData.ayahNumber },
            ayahData,
            { upsert: true },
          );

          totalAyahs++;
        }

        successCount++;
        console.log(
          `✅ Seeded Surah ${surah.number}: ${surah.englishName} (${surah.numberOfAyahs} ayahs)`,
        );
      } catch (surahError) {
        errorCount++;
        console.error(`❌ Failed to seed surah ${surah.number}:`);
        // Continue with next surah instead of failing completely
      }
    }

    console.log(
      `🎉 Quran database seeding completed! Success: ${successCount}/114 Surahs, Total: ${totalAyahs} Ayahs, Errors: ${errorCount}`,
    );

    return {
      success: true,
      message: "Quran database seeded successfully",
      data: {
        totalSurahs: successCount,
        totalAyahs,
        errors: errorCount,
      },
    };
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to seed Quran database",
    );
  }
};
// const getAllSurahsFromDB = async (query: Record<string, unknown>) => {
//   try {
//     const baseQuery = Surah.find({ isDeleted: false });

//     const surahQuery = new QueryBuilder(baseQuery, query)
//       .search(["nameEnglish", "nameArabic", "nameTransliteration"])
//       .filter()
//       .sort()
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
//       data: result,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to retrieve surahs",
//     );
//   }
// };

const getAllSurahsFromDB = async (query: Record<string, unknown>) => {
  try {
    // Add default sort by surahNumber if no sort is specified
    if (!query.sort) {
      query.sort = "surahNumber";
    }

    const baseQuery = Surah.find({ isDeleted: false });

    const surahQuery = new QueryBuilder(baseQuery, query)
      .search(["nameEnglish", "nameArabic", "nameTransliteration"])
      .filter()
      .sort() // This will use 'surahNumber' as default
      .fields()
      .paginate();

    const [result, total] = await Promise.all([
      surahQuery.modelQuery.exec(),
      Surah.countDocuments(surahQuery.modelQuery.getFilter()),
    ]);

    const limit = Math.max(1, Math.min(Number(query.limit) || 114, 114));
    const page = Math.max(1, Number(query.page) || 1);
    const totalPage = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
      data: result, // This will have surah 1 first, then 2, 3... 114
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve surahs",
    );
  }
};

const getSingleSurahFromDB = async (surahNumber: number) => {
  // Check if surah exists
  const surah = await Surah.findOne({ surahNumber, isDeleted: false });

  if (!surah) {
    throw new AppError(httpStatus.NOT_FOUND, "Surah not found");
  }

  // Get all ayahs for this surah
  const ayahs = await Ayah.find({ surahNumber, isDeleted: false }).sort({
    ayahNumber: 1,
  });

  if (!ayahs || ayahs.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Ayahs not found for this surah");
  }

  return {
    surah,
    ayahs,
    totalAyahs: ayahs.length,
  };
};

const getSingleAyahFromDB = async (surahNumber: number, ayahNumber: number) => {
  const ayah = await Ayah.findOne({
    surahNumber,
    ayahNumber,
    isDeleted: false,
  }).populate("surah");

  if (!ayah) {
    throw new AppError(httpStatus.NOT_FOUND, "Ayah not found");
  }

  return ayah;
};

// const searchAyahsInDB = async (
//   searchTerm: string,
//   query: Record<string, unknown>,
// ) => {
//   if (!searchTerm || searchTerm.trim().length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Search term is required");
//   }

//   try {
//     // Use text search for better results
//     const searchRegex = new RegExp(searchTerm, "i");
//     console.log(searchRegex);
//     const baseQuery = Ayah.find({
//       isDeleted: false,
//       $or: [{ textEnglish: searchRegex }, { textArabic: searchRegex }],
//     }).populate("surah");

//     const ayahQuery = new QueryBuilder(baseQuery, query)
//       .filter()
//       .sort()
//       .fields()
//       .paginate();

//     const [result, total] = await Promise.all([
//       ayahQuery.modelQuery.limit(50).exec(), // Limit to 50 results for performance
//       Ayah.countDocuments(ayahQuery.modelQuery.getFilter()),
//     ]);

//     // Enhance results with surah info
//     const enhancedResults = await Promise.all(
//       result.map(async (ayah) => {
//         const surah = await Surah.findOne({ surahNumber: ayah.surahNumber });
//         return {
//           ...ayah.toObject(),
//           surahInfo: surah,
//         };
//       }),
//     );

//     const limit = Math.max(1, Math.min(Number(query.limit) || 20, 50));
//     const page = Math.max(1, Number(query.page) || 1);
//     const totalPage = Math.ceil(total / limit);

//     return {
//       meta: {
//         page,
//         limit,
//         total,
//         totalPage,
//         searchTerm,
//       },
//       data: enhancedResults,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to search ayahs",
//     );
//   }
// };

const searchAyahsInDB = async (searchTerm: string) => {
  const clean = searchTerm.trim();

  const filter = {
    isDeleted: false,
    $text: { $search: clean },
  };

  let result = await Ayah.find(filter, {
    score: { $meta: "textScore" },
  })
    .populate("surah")
    .sort({ score: { $meta: "textScore" } })
    .limit(20);

  if (result.length === 0) {
    const regex = new RegExp(clean, "i");

    result = await Ayah.find({
      isDeleted: false,
      textEnglish: regex,
    })
      .populate("surah")
      .limit(20);
  }

  return {
    meta: {
      total: result.length,
      searchTerm: clean,
    },
    data: result,
  };
};

const getAyahsByJuzFromDB = async (
  juzNumber: number,
  query: Record<string, unknown>,
) => {
  try {
    const baseQuery = Ayah.find({ juz: juzNumber, isDeleted: false })
      .populate("surah")
      .sort({ surahNumber: 1, ayahNumber: 1 });

    const ayahQuery = new QueryBuilder(baseQuery, query)
      .filter()
      .fields()
      .paginate();

    const [result, total] = await Promise.all([
      ayahQuery.modelQuery.exec(),
      Ayah.countDocuments(ayahQuery.modelQuery.getFilter()),
    ]);

    const limit = Math.max(1, Math.min(Number(query.limit) || 100, 200));
    const page = Math.max(1, Number(query.page) || 1);
    const totalPage = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage,
        juz: juzNumber,
      },
      data: result,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve ayahs by juz",
    );
  }
};

const getAyahsByPageFromDB = async (pageNumber: number) => {
  try {
    const ayahs = await Ayah.find({ page: pageNumber, isDeleted: false })
      .populate("surah")
      .sort({ surahNumber: 1, ayahNumber: 1 });

    if (!ayahs || ayahs.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "Page not found");
    }

    return {
      page: pageNumber,
      totalAyahs: ayahs.length,
      ayahs,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve ayahs by page",
    );
  }
};

const getSurahStatsFromDB = async () => {
  try {
    const totalSurahs = await Surah.countDocuments({ isDeleted: false });
    const totalAyahs = await Ayah.countDocuments({ isDeleted: false });
    const meccanSurahs = await Surah.countDocuments({
      revelationType: "Meccan",
      isDeleted: false,
    });
    const medinanSurahs = await Surah.countDocuments({
      revelationType: "Medinan",
      isDeleted: false,
    });

    // Get longest surah
    const longestSurah = await Surah.findOne({ isDeleted: false })
      .sort({ totalAyahs: -1 })
      .limit(1);

    // Get shortest surah
    const shortestSurah = await Surah.findOne({ isDeleted: false })
      .sort({ totalAyahs: 1 })
      .limit(1);

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
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve Quran statistics",
    );
  }
};

export const QuranService = {
  seedQuranFromAPI,
  getAllSurahsFromDB,
  getSingleSurahFromDB,
  getSingleAyahFromDB,
  searchAyahsInDB,
  getAyahsByJuzFromDB,
  getAyahsByPageFromDB,
  getSurahStatsFromDB,
};
