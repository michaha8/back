"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
* @swagger
* tags:
*   name: User
*   description: User route
*/
const user_1 = __importDefault(require("../controllers/user"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User details
 *       '404':
 *         description: User not found
 */
router.get('/email/:email', user_1.default.getUserTypeByEmail);
router.get('/:id', user_1.default.getUserById);
router.get('/', user_1.default.getAllInternsUsers);
// Define the catch-all route last
router.get('*', (req, res) => {
    res.status(404).send('Not found');
});
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     requestBody:
 *       description: User object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User not found
 */
router.put('/', user_1.default.upadteUserIntern);
module.exports = router;
//# sourceMappingURL=userRoute.js.map