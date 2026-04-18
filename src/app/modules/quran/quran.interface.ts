import { Types } from "mongoose";

export interface ISurah {
  surahNumber: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  totalAyahs: number;
  revelationType: "Meccan" | "Medinan";
  order: number;
  isDeleted?: boolean;
}

export interface IAyah {
  surahNumber: number;
  ayahNumber: number;
  textArabic: string;
  textEnglish: string;
  juz: number;
  page: number;
  sajda: boolean;
  isDeleted?: boolean;
}

export interface ISearchResult {
  _id: Types.ObjectId;
  surahNumber: number;
  ayahNumber: number;
  textArabic: string;
  textEnglish: string;
  surah?: ISurah;
}

export interface IQueryResult {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IAyah[] | ISurah[];
}
