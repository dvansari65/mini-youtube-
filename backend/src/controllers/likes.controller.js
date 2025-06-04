import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Like } from "../models/likes.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.models.js"
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
const toggleVideoLike = AsyncHandler(async (req,res)=>{
        const {videoId} = req.params;
        console.log("videoId",videoId)
        const user = req.user?._id
        console.log("req.params:",req.params)
        if(!videoId){
            throw new ApiError(404,"video not found")
        }

        if(!user){
            throw new ApiError(404,"unauthorized request")
        }
        const video = await Video.findById(videoId)
        if(!video ){
            throw new ApiError(404,"video not found")
        }
        console.log("video:",video)

       try {
         const isLiked  = await Like.findOne(
             {
                 video:videoId,
                 likedBy:user
             }
         )
         
         console.log("isliked",isLiked)
         let likesCount;
         if(isLiked){
             await Like.deleteMany(
                 {
                     video:videoId,
                     likedBy:user
                 }
             )
             const updatedLikedVideo = await Video.findByIdAndUpdate(
                 videoId,
                 {$inc:{likesCount:-1}},
                 {new : true}
             )
             likesCount = updatedLikedVideo.likesCount
             return res
             .status(200)
             .json(
                 new ApiResponse(200,{isLiked:false,likesCount},"video unliked")
             )
         }else{
             await Like.create(
                 {
                     video:videoId,
                     likedBy:user
                 }
             )
             const updatedLikedVideo = await Video.findByIdAndUpdate(
                 videoId,
                 {$inc:{likesCount:1}},
                 {new : true}
             )
             likesCount = updatedLikedVideo.likesCount
             return res
             .status(200)
             .json(
                 new ApiResponse(200,{isLiked:true,likesCount},"video liked")
             )
         }
       } catch (error) {
            console.error("something went wrong while toggling the video like",error)
            throw new ApiError(500,"something went wrong while toggling the video like")
       }
         
})

const toggleCommentLike = AsyncHandler( async()=>{
        const {commentId} = req.params
        const user = req.user?._id
        console.log("comment id :",commentId)
        const isCommentExists = await Like.findOne(commentId)
        if(!isCommentExists){
            throw new ApiError(404,"comment not found")
        }
        if(!user){
            throw new ApiError(404,"unauthorized request")
        }
        try {
            const existingLike = await Like.findOne({likedBy:user,comment:commentId})
    
            if(existingLike){
                await Like.deleteMany({_id:existingLike._id})
                await Comment.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:-1
                    }
                },
                {
                    new:true,
                })
                return res.status(200).json( new ApiResponse(200,{},"comment got disliked"))
            }else{
                await Like.create({comment:commentId,likedBy:user})
                await Comment.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:1
                    }
                },
                {
                    new:true,
                })

                return res.status(200).json( new ApiResponse(200,{},"liked comment"))
            }
           
        } catch (error) {
            console.error("Error toggling comment like:", error.message);
            throw new ApiError(500, "Something went wrong while toggling coment like");
        }

})

const toggleTweetLike = AsyncHandler( async (req,res)=>{
        const {tweetId} = req.params
        const user = req.user?._user

        if(!user){
            throw new ApiError(404,"unauthorized request")
        }
        isTweetExist = await Like.findOne(tweetId)
        if(!isTweetExist){
            throw new ApiError(404,"like not found")
        }

        try {
            const existingLike = await Like.findOne({likedBy:user,tweet:tweetId})
            if(existingLike){
                await Like.deleteOne({_id:existingLike?._id})
                await Tweet.findByIdAndUpdate(
                    tweetId,
                    {
                        $inc:{count:-1}
                    },
                    {
                        new:true,
                    }
                )
                return res.status(200).json(new ApiResponse(200,{},"you disliked the video"))
            }else{
                await Like.create({tweet:tweetId, likedBy:user})
                await Tweet.findByIdAndUpdate(
                    tweetId,
                    {
                        $inc:{
                            count:1
                        }
                    },
                    {
                        new:true,
                    }
                )
                return res.status(200).json(new ApiResponse(200,{},"you liked the videos"))
            }


        } catch (error) {
            console.error("Error toggling tweet like:", error.message);
            throw new ApiError(500, "Something went wrong while toggling tweet like");
        }

})
const getAllLikedVideos = AsyncHandler( async (req,res)=>{
        const user = req.user._id

        if(!user){
            throw new ApiError(400,"unauthorized request")
        }
        try {
            const videos = await Video.find()
    
            const videoId = videos.map(video=>video?._id.toString())
    
            const allVideos = await Like.find(
                {
                    likedBy:user,
                    video:videoId
                }
            )
            console.log("all videos:",allVideos)
            return res
            .status(200)
            .json(
                new ApiResponse(200,{allVideos},"all liked videos fetched successfully")
            )
        } catch (error) {
            console.error("something went wrong while fetching the videos",error)
            throw new ApiError(500,"something went wrong while fetching the videos")
        }

        
})

const totalUserVideoslikes = AsyncHandler( async(req,res)=>{
        const user = req.user?._id
        if(!user){
            throw new ApiError(402,"unAuthorized request")
        }
       try {
         const videos = await Video.find()
         const videoIds = videos.map(video=>video?._id)
        
        //  console.log("video ids:",videoIds)
         const videoLikesCount = await Like.countDocuments({video:videoIds})
         const allLikesVideos = await Like.find({video:videoIds})
         return res
         .status(200)
         .json(
            new ApiResponse(200,{videoLikesCount,allLikesVideos},"videos fetched successfully")
         )
        
       } catch (error) {
        console.error("something went wrong",error)
        throw new ApiError(500,"something went wrong")
       }
})
export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getAllLikedVideos,totalUserVideoslikes} 