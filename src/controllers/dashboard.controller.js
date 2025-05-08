import AsyncHandler from "../utils/AsyncHandler.js";
import { Video } from "../models/video.models.js";
// import { Like } from "../models/likes.models.js"
// import { Subscription } from "../models/subscription.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Like } from "../models/likes.models.js";
import { Subscription } from "../models/subscription.models.js";


const getChannelStats = AsyncHandler( async (req,res)=>{
    const user = req.user._id
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const videos = await Video.find({owner:user})
    if(!videos || videos.length==0){
        throw new ApiError(404,"videos not found")
    }
    
    const videoId =   videos.map((videoId)=>videoId._id)
    if(!videoId || videos.length==0){
        throw new ApiError(404,"there is no videos in database")
    }
    const totalLikes = await Like.countDocuments({video:{$in:videoId}})
    if(!totalLikes || totalLikes.length==0){
        throw new ApiError(404,"there is no likes in the database")
    }

    const totalSubscriber = await Subscription.countDocuments({channel:user})
    if(!totalSubscriber || totalSubscriber == undefined){
        throw new ApiError(404,"there is no subscriber of this channel")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{videos:videos,totalLikesOfVideos:totalLikes,totalSubscriber:totalSubscriber},"these are yours videos")
    )
})

export {getChannelStats}