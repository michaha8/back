import User from '../models/user_model'
import {Request, Response} from 'express'


function sendError(res:Response, error:string){
    res.status(400).send({
        'error': error
    })
}
const getUserById = async (req: Request,res: Response)=>{
    console.log('in here GetUserByID')
    console.log('in here GetUserByID')
    console.log('in here GetUserByID')
    console.log('in here GetUserByID')
    
    try{
        const user = await User.findById(req.params.id)
        console.log(user)
        res.status(200).send(user)
        
    }catch(err){
        res.status(400).send({'error': 'Failed to get user from DB'})
    }
}

const getAllInternsUsers = async (req: Request,res: Response) => {
    console.log("getAllInternsUsers");
    try {
      const users = await User.find({ userType: 'intern' })
      console.log('users-GetAllUsers');
      console.log(users);
      res.status(200).send(users)
    } catch(err) {
      res.status(400).send({'error': 'Failed to get users from DB'})
    }
  }
  const getAllHospitalsUsers = async (req: Request,res: Response) => {
    console.log("getAllHospitalsUsers");
    try {
      const users = await User.find({ userType: 'hospital' })
      console.log('users-GetAllUsers');
      console.log(users);
      res.status(200).send(users)
    } catch(err) {
      res.status(400).send({'error': 'Failed to get users from DB'})
    }
  }
const getUserTypeByEmail=async(req:Request,res:Response)=>{
    console.log(req.params.email)
    console.log('Email '+ req.params.email)
    console.log('in here GetTypeByEmail'+req.params.email)
    try{
        const user = await User.findOne({'email' : req.params.email})
        console.log(user);
        res.status(200).send(user)
    }catch(err){
        res.status(400).send({'error': 'Failed to get user from DB'})
    }
}
const getUserByIdIntern=async(req:Request,res:Response)=>{
    console.log(req.params.idIntern)
    console.log('Id Intern '+ req.params.idIntern)
    console.log('in here GetUSerByIdIntern'+req.params.idIntern)
    try{
        const user = await User.findOne({'idIntern' : req.params.idIntern})
        console.log(user);
        res.status(200).send(user)
    }catch(err){
        res.status(400).send({'error': 'Failed to get user from DB'})
    }
}

const upadteUserIntern = async (req: Request,res: Response)=>{
    console.log('id'+req.body.id)
    console.log(req.body.name)
    console.log("UpdateUser")
    console.log(req.body.userType)
    console.log(req.body)
       
if(req.body.userType==='intern'){
    console.log("UpdateUser Intern")
    const name= req.body.name;
    const avatarUrl = req.body.avatarUrl;
    const id = req.body.id;
    console.log(id);
    const email=req.body.email
    const  city=req.body.city
    const  educationalInstitution =req.body.educationalInstitution
    const  typeOfInternship=req.body.typeOfInternship
    const  GPA=req.body.GPA
    const  description=req.body.description
    const  partnerID=req.body.partnerID  
    const  phoneNumber=req.body.phoneNumber   
    const idIntern=req.body.idIntern
    const preferenceArray=req.body.preferenceArray 
  

    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                name,
                idIntern,
                avatarUrl,
                email,
                city,
                educationalInstitution,
                typeOfInternship,
                GPA,
                description,
                partnerID,
                phoneNumber,
                preferenceArray
            }
        });

        await user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}else{
    console.log("UpdateUserHospital")
    const name= req.body.name;
    const id = req.body.id;
  
    const email=req.body.email
    const  city=req.body.city
    const  description=req.body.description

    const  phoneNumber=req.body.phoneNumber   
  
    const preferenceArray=req.body.preferenceArray 
    const hospitalQuantity=req.body.hospitalQuantity
  console.log(req.body);

    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                name,
                email,
                city,
                description,
                phoneNumber,
                hospitalQuantity,
                preferenceArray
            }
        });

        await user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }

}
}


export = {getUserById,upadteUserIntern,getUserTypeByEmail,getAllInternsUsers,getUserByIdIntern,getAllHospitalsUsers}