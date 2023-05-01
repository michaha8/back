/**
* @swagger
* tags:
*   name: User
*   description: User route
*/
import user from '../controllers/user'
import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

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
router.get('/email/:email', user.getUserTypeByEmail)
router.get('/:id', user.getUserById)
router.get('/idIntern/:idIntern', user.getUserByIdIntern);
// router.get('/', user.getAllInternsUsers)
router.get('/', user.getAllInternsUsers)
router.get('/hospital/getAllHospitals', user.getAllHospitalsUsers)
router.get('/algorithm/runAlgorithm',user.runMatchingAlgorithm)
router.get('/algorithm/runTabuSearchAlgorithm',user.runTabuSearchAlgorithm)
router.get('/checkIfAllInternsAddPreference/checkIfAllInternsAddPreference',user.checkIfAllInternsAddPreference)
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
router.put('/',user.upadteUserIntern)

export = router
