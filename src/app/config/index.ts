import * as dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.port,
  database_url: process.env.database_url,
  frontend_url: process.env.frontend_url,
  NODE_ENV: process.env.NODE_ENV,
  QURAN_API_BASE_URL: process.env.QURAN_API_BASE_URL,
  DEFAULT_TRANSLATION: process.env.DEFAULT_TRANSLATION,
};
