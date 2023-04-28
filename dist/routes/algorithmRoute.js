"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const algorithms_1 = __importDefault(require("../controllers/algorithms"));
router.put('/algorithm/runAlgorithm', algorithms_1.default.runMatchingAlgorithm);
module.exports = router;
//# sourceMappingURL=algorithmRoute.js.map