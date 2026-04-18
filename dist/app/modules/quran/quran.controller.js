"use strict";
// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { QuranService } from "./quran.service";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranController = void 0;
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
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const quran_service_1 = require("./quran.service");
/**
 * ✅ Normalize query param (fixes string | string[] সমস্যা)
 */
const getQueryParam = (param) => {
    if (Array.isArray(param))
        return param[0];
    if (typeof param === "string")
        return param;
    return undefined;
};
const seedQuran = (0, catchAsync_1.default)(async (req, res) => {
    const result = await quran_service_1.QuranService.seedQuranFromAPI();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Quran database seeded successfully",
        data: result,
    });
});
const getAllSurahs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await quran_service_1.QuranService.getAllSurahsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Surahs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSingleSurah = (0, catchAsync_1.default)(async (req, res) => {
    const surahId = getQueryParam(req.params.id);
    const surahNumber = Number(surahId);
    if (!surahId || isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid surah number. Must be between 1 and 114",
            data: null,
        });
    }
    const result = await quran_service_1.QuranService.getSingleSurahFromDB(surahNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Surah ${result.surah.nameEnglish} retrieved successfully`,
        data: result,
    });
});
const getSingleAyah = (0, catchAsync_1.default)(async (req, res) => {
    const surahId = getQueryParam(req.params.surahId);
    const ayahId = getQueryParam(req.params.ayahId);
    const surahNumber = Number(surahId);
    const ayahNumber = Number(ayahId);
    if (!surahId || isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid surah number",
            data: null,
        });
    }
    if (!ayahId || isNaN(ayahNumber) || ayahNumber < 1) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid ayah number",
            data: null,
        });
    }
    const result = await quran_service_1.QuranService.getSingleAyahFromDB(surahNumber, ayahNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Ayah ${ayahNumber} of Surah ${surahNumber} retrieved successfully`,
        data: result,
    });
});
// const searchAyahs = catchAsync(async (req, res) => {
//   const q = getQueryParam(req.query.q);
//   if (!q) {
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
const searchAyahs = (0, catchAsync_1.default)(async (req, res) => {
    const q = (req.query.q || req.query.search);
    if (!q || q.trim().length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Search query parameter "q" is required',
            data: null,
        });
    }
    const result = await quran_service_1.QuranService.searchAyahsInDB(q, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Found ${result.meta.total} results`,
        meta: result.meta,
        data: result.data,
    });
});
const getAyahsByJuz = (0, catchAsync_1.default)(async (req, res) => {
    const juzParam = getQueryParam(req.params.juzNumber);
    const juz = Number(juzParam);
    if (!juzParam || isNaN(juz) || juz < 1 || juz > 30) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid juz number. Must be between 1 and 30",
            data: null,
        });
    }
    const result = await quran_service_1.QuranService.getAyahsByJuzFromDB(juz, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Ayahs from Juz ${juz} retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getAyahsByPage = (0, catchAsync_1.default)(async (req, res) => {
    const pageParam = getQueryParam(req.params.pageNumber);
    const page = Number(pageParam);
    if (!pageParam || isNaN(page) || page < 1 || page > 604) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid page number. Must be between 1 and 604",
            data: null,
        });
    }
    const result = await quran_service_1.QuranService.getAyahsByPageFromDB(page);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Ayahs from Page ${page} retrieved successfully`,
        data: result,
    });
});
const getQuranStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await quran_service_1.QuranService.getSurahStatsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quran statistics retrieved successfully",
        data: result,
    });
});
exports.QuranController = {
    seedQuran,
    getAllSurahs,
    getSingleSurah,
    getSingleAyah,
    searchAyahs,
    getAyahsByJuz,
    getAyahsByPage,
    getQuranStats,
};
