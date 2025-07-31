import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Like } from "../models/likes.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Comment} from "../models/comment.models.js"
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
const toggleVideoLike = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user?._id;
  
    if (!videoId) throw new ApiError(404, "video not found");
    if (!user) throw new ApiError(401, "unauthorized request");
  
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "video not found");
    let updatedVideo;
    let likesCount;
  
    try {
      const isLiked = await Like.findOne({ video: videoId, likedBy: user });
      if (isLiked) {
        await Like.deleteOne({ video: videoId, likedBy: user });
  
        updatedVideo = await Video.findByIdAndUpdate(
          videoId,
          { $inc: { likesCount: -1 },
            $pull:{likes: mongoose.Types.ObjectId(user)}
        },
          { new: true }
        );
        // Ensure non-negative count
        if (updatedVideo.likesCount < 0) {
          updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: { likesCount: 0 },
               $unset:{likes:''}
            },
            { new: true }
          );
        }
  
        likesCount = updatedVideo.likesCount;
  
        return res.status(200).json(
          new ApiResponse(200, { isLiked: false, likesCount }, "video unliked")
        );
      } else {
        // Like the video
        await Like.create({ video: videoId, likedBy: user });
  
        updatedVideo = await Video.findByIdAndUpdate(
          videoId,
          { $inc: { likesCount: 1 } ,
            $push:{likes:mongoose.Types.ObjectId(user)}
        },
          { new: true }
        );
        likesCount = updatedVideo.likesCount;
  
        return res.status(200).json(
          new ApiResponse(200, { isLiked: true, likesCount }, "video liked")
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      throw new ApiError(500, "Something went wrong while toggling the video like");
    }
  });
       


const toggleCommentLike = AsyncHandler( async()=>{
        const {commentId} = req.params
        const user = req.user?._id
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
                await Like.deleteOne({_id:existingLike._id})
                await Like.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:-1
                    }
                },
                {
                    new:true,
                })
                return res.status(200).json( new ApiResponse(200,{isLiked:false},"comment got disliked"))
            }else{
                await Like.create({comment:commentId,likedBy:user})
                await Like.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:1
                    }
                },
                {
                    new:true,
                })

                return res.status(200).json( new ApiResponse(200,{isLiked:true},"comment liked!"))
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
            if(videoId){
                const allVideos = await Like.find(
                    {
                        likedBy:user,
                        video:videoId
                    }
                ).sort({createdAt:-1})
                
                return res
                .status(200)
                .json(
                    new ApiResponse(200,{allVideos},"all liked videos fetched successfully")
                )
            }
        } catch (error) {
            console.error("something went wrong while fetching the videos!",error)
            throw new ApiError(500,"something went wrong while fetching the videos")
        }

        
})

const totalUserVideoslikes = AsyncHandler( async(req,res)=>{
        const user = req.user?._id
        if(!user){
            throw new ApiError(402,"unAuthorized request")
        }
       try {
         const videos = await Video.find({owner:user})
         const videoIds = videos.map(video=>video._id.toString())
         if(!videoIds){
            throw new ApiError("video ids not found!",404)
         }
         try {
            const [videoLikesCount,allLikesVideos] = await Promise.all([
                Like.countDocuments({video:videoIds}),
                Like.find({video:videoIds})
             ])
             return res
             .status(200)
             .json(
                new ApiResponse(200,{videoLikesCount,allLikesVideos},"videos fetched successfully")
             )
         } catch (error) {
            console.log("failed to count videos likes!",error)
            throw new ApiError("failed to count videos likes!",500)
         }
        
       } catch (error) {
        console.error("something went wrong",error)
        throw new ApiError(500,"something went wrong")
       }
})

const numberOfLikesOfVideos = AsyncHandler( async (req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(404,"please provide video id ")
    }
    try {
        const videoLikes = await Like.countDocuments({video:videoId})
        if(!videoLikes){
            throw new ApiError("video likes not obtained!",404)
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200,{videoLikes:videoLikes},"total likes of videos")
        )
    } catch (error) {
        console.error("failed to fetched likes count",error)
    }
})

const checkLikeStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user?._id;

    if (!videoId) throw new ApiError(404, "video not found");
    if (!user) throw new ApiError(401, "unauthorized request");

    try {
        const isLiked = await Like.findOne({ video: videoId, likedBy: user });
        return res.status(200).json(
            new ApiResponse(200, { isLiked: !!isLiked }, "Like status fetched successfully")
        );
    } catch (error) {
        console.error("Error checking like status:", error);
        throw new ApiError(500, "Something went wrong while checking like status");
    }
});

export {
    toggleVideoLike,
    toggleCommentLike,
    numberOfLikesOfVideos,
    toggleTweetLike,
    getAllLikedVideos,
    totalUserVideoslikes,
    checkLikeStatus
} 