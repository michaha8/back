/**
 * @swagger
 * tags:
 *   name: Index
 *   description: The Index API 
 */

import express from 'express'
const router = express.Router()

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
router.get('/',(req, res)=>{
    res.send('Hello world!!')
})


export = router