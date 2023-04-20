import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
  
})

export = mongoose.model('ForgetPasswordRequest',postSchema)