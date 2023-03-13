import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
        default: () => new ObjectId(),
      },

    email:{
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    }, 
    city: {
        type: String,
        required: true
    },
     userType: {
        type: String,
        enum: ["hospital", "intern"],
        required: true,
    },
     hospitalQuantity: {
        type: String,
        required: function () {
          return this.userType === "hospital"; // hospitalName is required only for hospital users
        },
    },
    educationalInstitution:{
        type: String,
        required: function () {
          return this.userType === "intern"; 
        },
    },  typeOfInternship:{
        type: String,
        required: function () {
          return this.userType === "intern"; 
        },
    },GPA:{
        type: String,
        required: function () {
          return this.userType === "intern"; 
        },
    },
    description:{
        type:String,
        required: false,
        maxlength: 100, 
    },
    refresh_tokens:{
        type: [String]
    },
});

export = mongoose.model('User',userSchema)