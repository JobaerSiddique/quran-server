import express from "express";
import { quranRoutes } from "../modules/quran/quran.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/quran",
    route: quranRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
