import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema({
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"comment"
    },
    likedBY:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    count:{
        type:Number,
        required:true,
        default:0,
    }
},{timestamps:true})

export const Like = mongoose.model("Like",likesSchema)