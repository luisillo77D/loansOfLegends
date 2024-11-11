import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true
    },
   
})

export default mongoose.model('Client', clientSchema)