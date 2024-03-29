/**
* @swagger
* tags:
*   name: User
*   description: User route
*/
import user from '../controllers/user'
import express, { NextFunction, Request, Response } from 'express'
import { route } from './postRoute'
const router = express.Router()

router.get('/:id', user.getUserById)


router.put('/',user.upadteUser)

export = router