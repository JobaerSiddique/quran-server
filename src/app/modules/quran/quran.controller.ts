// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { QuranService } from "./quran.service";

// const seedQuran = catchAsync(async (req, res) => {
//   const result = await QuranService.seedQuranFromAPI();

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Quran database seeded successfully",
//     data: result,
//   });
// });

// const getAllSurahs = catchAsync(async (req, res) => {
//   const result = await QuranService.getAllSurahsFromDB(req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Surahs retrieved successfully",
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getSingleSurah = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const surahNumber = parseInt(id);

//   if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid surah number. Must be between 1 and 114",
//       data: null,
//     });
//   }

//   const result = await QuranService.getSingleSurahFromDB(surahNumber);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Surah ${result.surah.nameEnglish} retrieved successfully`,
//     data: result,
//   });
// });

// const getSingleAyah = catchAsync(async (req, res) => {
//   const { surahId, ayahId } = req.params;
//   const surahNumber = parseInt(surahId);
//   const ayahNumber = parseInt(ayahId);

//   if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid surah number",
//       data: null,
//     });
//   }

//   if (isNaN(ayahNumber) || ayahNumber < 1) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid ayah number",
//       data: null,
//     });
//   }

//   const result = await QuranService.getSingleAyahFromDB(
//     surahNumber,
//     ayahNumber,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Ayah ${ayahNumber} of Surah ${surahNumber} retrieved successfully`,
//     data: result,
//   });
// });

// const searchAyahs = catchAsync(async (req, res) => {
//   const { q } = req.query;

//   if (!q || typeof q !== "string") {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: 'Search query parameter "q" is required',
//       data: null,
//     });
//   }

//   const result = await QuranService.searchAyahsInDB(q, req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Found ${result.meta.total} results for "${q}"`,
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getAyahsByJuz = catchAsync(async (req, res) => {
//   const { juzNumber } = req.params;
//   const juz = parseInt(juzNumber);

//   if (isNaN(juz) || juz < 1 || juz > 30) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid juz number. Must be between 1 and 30",
//       data: null,
//     });
//   }

//   const result = await QuranService.getAyahsByJuzFromDB(juz, req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Ayahs from Juz ${juz} retrieved successfully`,
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getAyahsByPage = catchAsync(async (req, res) => {
//   const { pageNumber } = req.params;
//   const page = parseInt(pageNumber);

//   if (isNaN(page) || page < 1 || page > 604) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid page number. Must be between 1 and 604",
//       data: null,
//     });
//   }

//   const result = await QuranService.getAyahsByPageFromDB(page);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `Ayahs from Page ${page} retrieved successfully`,
//     data: result,
//   });
// });

// const getQuranStats = catchAsync(async (req, res) => {
//   const result = await QuranService.getSurahStatsFromDB();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Quran statistics retrieved successfully",
//     data: result,
//   });
// });

// export const QuranController = {
//   seedQuran,
//   getAllSurahs,
//   getSingleSurah,
//   getSingleAyah,
//   searchAyahs,
//   getAyahsByJuz,
//   getAyahsByPage,
//   getQuranStats,
// };

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { QuranService } from "./quran.service";

/**
 * ✅ Normalize query param (fixes string | string[] সমস্যা)
 */
const getQueryParam = (param: unknown): string | undefined => {
  if (Array.isArray(param)) return param[0];
  if (typeof param === "string") return param;
  return undefined;
};

const seedQuran = catchAsync(async (req, res) => {
  const result = await QuranService.seedQuranFromAPI();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quran database seeded successfully",
    data: result,
  });
});

const getAllSurahs = catchAsync(async (req, res) => {
  const result = await QuranService.getAllSurahsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surahs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSurah = catchAsync(async (req, res) => {
  const surahId = getQueryParam(req.params.id);
  const surahNumber = Number(surahId);

  if (!surahId || isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid surah number. Must be between 1 and 114",
      data: null,
    });
  }

  const result = await QuranService.getSingleSurahFromDB(surahNumber);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Surah ${result.surah.nameEnglish} retrieved successfully`,
    data: result,
  });
});

const getSingleAyah = catchAsync(async (req, res) => {
  const surahId = getQueryParam(req.params.surahId);
  const ayahId = getQueryParam(req.params.ayahId);

  const surahNumber = Number(surahId);
  const ayahNumber = Number(ayahId);

  if (!surahId || isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid surah number",
      data: null,
    });
  }

  if (!ayahId || isNaN(ayahNumber) || ayahNumber < 1) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid ayah number",
      data: null,
    });
  }

  const result = await QuranService.getSingleAyahFromDB(
    surahNumber,
    ayahNumber,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Ayah ${ayahNumber} of Surah ${surahNumber} retrieved successfully`,
    data: result,
  });
});

const searchAyahs = catchAsync(async (req, res) => {
  const q = getQueryParam(req.query.q);

  if (!q) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Search query parameter "q" is required',
      data: null,
    });
  }

  const result = await QuranService.searchAyahsInDB(q, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Found ${result.meta.total} results for "${q}"`,
    meta: result.meta,
    data: result.data,
  });
});

const getAyahsByJuz = catchAsync(async (req, res) => {
  const juzParam = getQueryParam(req.params.juzNumber);
  const juz = Number(juzParam);

  if (!juzParam || isNaN(juz) || juz < 1 || juz > 30) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid juz number. Must be between 1 and 30",
      data: null,
    });
  }

  const result = await QuranService.getAyahsByJuzFromDB(juz, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Ayahs from Juz ${juz} retrieved successfully`,
    meta: result.meta,
    data: result.data,
  });
});

const getAyahsByPage = catchAsync(async (req, res) => {
  const pageParam = getQueryParam(req.params.pageNumber);
  const page = Number(pageParam);

  if (!pageParam || isNaN(page) || page < 1 || page > 604) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid page number. Must be between 1 and 604",
      data: null,
    });
  }

  const result = await QuranService.getAyahsByPageFromDB(page);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Ayahs from Page ${page} retrieved successfully`,
    data: result,
  });
});

const getQuranStats = catchAsync(async (req, res) => {
  const result = await QuranService.getSurahStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quran statistics retrieved successfully",
    data: result,
  });
});

export const QuranController = {
  seedQuran,
  getAllSurahs,
  getSingleSurah,
  getSingleAyah,
  searchAyahs,
  getAyahsByJuz,
  getAyahsByPage,
  getQuranStats,
};
