import mongoose, { Schema } from "mongoose";

const likesSchema = new Schema({
    tweet:{
        type:Schema.Types.Object,
        ref:"Tweet"
    },
    comment:{
        type:StriSchema.Types.ObjectId,
        ref:"comment"
    },
    likedBY:{
        type:StriSchema.Types.ObjectId,
        ref:"User",
    },
    video:{
        type:StriSchema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true})

export const Like = mongoose.model("Like",likesSchema)