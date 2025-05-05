import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";
import { Like } from "../models/likes.models";
import ApiResponse from "../utils/ApiResponse";

const toggleVideoLike = AsyncHandler(async (req,res)=>{
        const {videoId} = req.params;
        const user = req.user?._id
        console.log("req.params:",req.params)
        if(!videoId){
            throw new ApiError(404,"video not found")
        }
        if(!user){
            throw new ApiError(404,"unauthorized request")
        }

        const isVideoExists  = await Like.findOne(videoId)
        if(!isVideoExists){
            throw new ApiError(404,"video not found in the database")
        }
        
        try {
            const existingLike = await Like.findOne({video:videoId , likedBy:user})
            if(existingLike){
                await Like.deleteOne({_id:existingLike._id})
                await Like.findByIdAndUpdate(videoId,{
                    $inc:{
                        count:-1
                    }
                })
                return res.status(200).json( new ApiResponse(200,{},"video got disliked"))
            }else {
                await Like.create({likedBy:user, video:videoId})
                await Like.findByIdAndUpdate(videoId,{
                    $inc:{
                        count:1
                    }
                })
                return res.status(200).json( new ApiResponse(200,{},"video liked"))
            }
        } catch (error) {
            console.error("Error toggling video like:", error.message);
            throw new ApiError(500, "Something went wrong while toggling video like");
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
                await Like.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:-1
                    }
                })
                return res.status(200).json( new ApiResponse(200,{},"comment got disliked"))
            }else{
                await Like.create({comment:commentId,likedBy:user})
                await Like.findByIdAndUpdate(commentId,{
                    $inc:{
                        count:1
                    }
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
                await Like.findByIdAndUpdate(
                    tweetId,
                    {
                        $inc:{count:-1}
                    }
                )
                return res.status(200).json(new ApiResponse(200,{},"you disliked the video"))
            }else{
                await Like.create({tweet:tweetId, likedBy:user})
                await Like.findByIdAndUpdate(
                    tweetId,
                    {
                        $inc:{
                            count:1
                        }
                    }
                )
                return res.status(200).json(200,{},"you like the video")
            }


        } catch (error) {
            console.error("Error toggling tweet like:", error.message);
            throw new ApiError(500, "Something went wrong while toggling tweet like");
        }

})
const getAllLikedVideos = AsyncHandler( async (req,res)=>{

        const AllLikedVideos = await Like.find()
        if(AllLikedVideos.length === 0){
            throw new ApiError(404,"there is no any liked videos")
        }
        const numberOfLikedVideos  = AllLikedVideos?.length || 0
        return res
        .status(200)
        .json(
            new ApiResponse(200,{numberOfLikedVideos,AllLikedVideos},"your liked videos" )
        )
})
export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getAllLikedVideos} 