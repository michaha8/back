"use strict";
/**
 * @swagger
 * tags:
 *   name: Index
 *   description: The Index API
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a welcome message
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: Hello world!!
 */
router.get('/', (req, res) => {
    res.send('Hello world!!');
});
module.exports = router;
//# sourceMappingURL=indexRoute.js.map