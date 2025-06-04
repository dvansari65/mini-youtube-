import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new Schema({
    videoFile:{
        type:String,
        required:[true,"video must be provided!"]
    },
    thumbNail:{
        type:String,
        required:[true,"please provide Thumbnail"]
    },
    title:{
        type:String,
        required:[true,"tile must be provided!"]
    },
    description:{
        type:String,
        required:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        default:true,
        type:Boolean
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likesCount:{
        type:Number,
        default:0,
    }

},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)