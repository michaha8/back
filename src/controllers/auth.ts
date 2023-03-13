import User from '../models/user_model'
import {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function sendError(res:Response, error:string){
    res.status(400).send({
        'error': error
    })
}


const login = async (req: Request,res: Response)=>{
    const email = req.body.email
    const password = req.body.password
    if(email == null || password == null){
        return sendError(res, 'Please provide valid email and password')
    }

    try{
        const user = await User.findOne({'email': email})
        if (user == null) return sendError(res,'incorrect user or password')
        const match = await bcrypt.compare(password, user.password)
        if(!match) return sendError(res,'incorrect user or password')
        const accessToken = await jwt.sign(
            {'id': user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {'expiresIn': process.env.JWT_TOKEN_EXPIRATION}
        )
        const refreshToken = await jwt.sign(
            {'id': user._id},
            process.env.REFRESH_TOKEN_SECRET
        )
        if(user.refresh_tokens == null) user.refresh_tokens = [refreshToken]
        else user.refresh_tokens.push(refreshToken)
        await user.save()
        return res.status(200).send({
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'id': user._id,
            userType: user.userType,
        })
    }catch (err){
        console.log("error:" + err)
        sendError(res,'fail checking user')
    }
}

const refresh = async (req: Request,res: Response)=>{
    const authHeader = req.headers['authorization']
    if(authHeader == null) return sendError(res,'authtentication missing')
    const refreshToken = authHeader.split(' ')[1]
    if(refreshToken == null) return sendError(res,'authtentication missing')

    try{
        const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user["id"])
        if(userObj == null) return sendError(res,'fail validating token')

        if (!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res,'fail validating token')
        }

        let newAccessToken, newRefreshToken;
        if (userObj.userType === 'hospital') {
            newAccessToken = await jwt.sign(
                {'id': user["id"]},
                process.env.ACCESS_TOKEN_SECRET,
                {'expiresIn': process.env.JWT_TOKEN_EXPIRATION}
            );
            newRefreshToken = await jwt.sign(
                {'id': user["id"]},
                process.env.REFRESH_TOKEN_SECRET
            );
        } else if (userObj.userType === 'intern') {
            newAccessToken = await jwt.sign(
                {
                    'id': user["id"],
                    'educationalInstitution': userObj.educationalInstitution,
                    'typeOfInternship': userObj.typeOfInternship,
                    'GPA': userObj.GPA
                },
                process.env.ACCESS_TOKEN_SECRET,
                {'expiresIn': process.env.JWT_TOKEN_EXPIRATION}
            );
            newRefreshToken = await jwt.sign(
                {'id': user["id"]},
                process.env.REFRESH_TOKEN_SECRET
            );
        } else {
            return sendError(res, 'Invalid user type');
        }

        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = newRefreshToken;
        await userObj.save();

        return res.status(200).send({
            'accessToken': newAccessToken,
            'refreshToken': newRefreshToken
        })

    } catch(err){
        return sendError(res,'fail validating token')
    }
}


const logout = async (req: Request,res: Response)=>{
    const authHeader = req.headers['authorization']
    if(authHeader == null) return sendError(res,'authtentication missing')
    const refreshToken = authHeader.split(' ')[1]
    if(refreshToken == null) return sendError(res,'authtentication missing')

    try{
        const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user["id"])
        if(userObj == null) return sendError(res,'fail validating token')

        if (!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res,'fail validating token')
        }

        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken,1))
        await userObj.save()
        return res.status(200).send()
    } catch(err){
        return sendError(res,'fail validating token')
    }
}

const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        return sendError(res, 'Authentication missing');
    }
    
    const tokenType = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (token == null) {
        return sendError(res, 'Authentication missing');
    }

    try {
        let user;

        if (tokenType === 'Bearer') {
            user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } else if (tokenType === 'Refresh') {
            user = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } else {
            return sendError(res, 'Invalid token type');
        }

        req.body.userId = user.id;
        console.log("token user:" + user);
        next();
    } catch (err) {
        return sendError(res, 'Failed to validate token');
    }
};

///////////////////////////////////////////////////////////////////////////
const register= async (req: Request, res: Response) => {
    const { email, password, name, phoneNumber, avatarUrl, city, userType, description } = req.body;
  
    if (!email || !password || !name || !phoneNumber || !avatarUrl || !city) {
      return res.status(400).send({ error: "Please provide valid values" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).send({ error: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
  
      let user;
      if (userType === "intern") {
        const { educationalInstitution, typeOfInternship, GPA } = req.body;
        if (!educationalInstitution || !typeOfInternship || !GPA) {
          return res.status(400).send({ error: "Please provide valid values" });
        }
        user = new User({
          email,
          password: encryptedPassword,
          name,
          phoneNumber,
          avatarUrl,
          city,
          userType,
          educationalInstitution,
          typeOfInternship,
          GPA,
          description,
          refresh_tokens: [],
        });
      } else if (userType === "hospital") {
        const { hospitalQuantity } = req.body;
        if (!hospitalQuantity) {
          return res.status(400).send({ error: "Please provide valid values" });
        }
        user = new User({
          email,
          password: encryptedPassword,
          name,
          phoneNumber,
          avatarUrl,
          city,
          userType,
          hospitalQuantity,
          description,
          refresh_tokens: [],
        });
      } else {
        return res.status(400).send({ error: "Please provide a valid user type" });
      }
  
      await user.save();
      res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to register user" });
    }
  };
  

export = {login ,refresh , logout, authenticateMiddleware,register}