"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quran_route_1 = require("../modules/quran/quran.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/quran",
        route: quran_route_1.quranRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
