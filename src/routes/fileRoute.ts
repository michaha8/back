/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/

import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import multer from 'multer'

const base = "http://192.168.1.10:3000/"
const storage = multer.diskStorage({
    destination: function (req: Request, file: unknown, cb) {
        cb(null, 'src/uploads/')
    },
    filename: function (req, file, cb) {
        console.log('multer storage callback')
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
})

const upload = multer({ storage: storage });
interface MulterRequest extends Request{
    file:any;
}

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 */
router.post('/file', upload.single("file"), function (req: Request, res: Response) {
    console.log("router.post(/file: " + base + (req as MulterRequest).file.path)
    res.status(200).send({ url: base +(req as MulterRequest).file.path })
});


export = router