import mongoose from 'mongoose';
const url = 'mongodb+srv://luisillo77mario:szsnJkoLMZD7wa0A@cluster0.xiwinnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export const connectdb = async () =>{
    try {
        await mongoose.connect(url);
        console.log("conexion exitosa")
    } catch (error) {
        console.log(error)
    }
}