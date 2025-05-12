import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Schema } from "mongoose";
const playListSchema = new Schema({
    videos:[{
        type:Schema.Types.ObjectId,
        ref:"Video",
        reqiured:true
    }],
    title:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String,
        required:true
    },

},{timestamps:true})

playListSchema.plugin(mongooseAggregatePaginate)

export const PlayList = mongoose.model("PlayList",playListSchema)