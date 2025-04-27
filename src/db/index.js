import { DB_NAME } from "../constants.js"
import mongoose from "mongoose"
import express from "express"
const app = express()
const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI }/${DB_NAME}`)
        app.listen(process.env.PORT,()=>{
            console.log(`db connected on host: ${connectionInstance.connection.host}`)
        })
    } catch (error) {
        console.log(
            "error",error
        )
        throw error;
        process.exit(1)
    }
}

export default connectDB