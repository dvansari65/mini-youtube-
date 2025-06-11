import ApiError from "../utils/ApiError.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import { Comment } from "../models/comment.models.js"
import { Video } from "../models/video.models.js"
import {User} from "../models/user.models.js"
import ApiResponse from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const getAllComments = AsyncHandler(async (req, res) => {
    const { videoId } = req.query;
  
    if (!videoId) {
      throw new ApiError(400, "Please provide video id");
    }
  
    try {
      const videoComments = await Comment.find({ video: videoId }).populate("owner", "userName avatar");
  
      if (!videoComments || videoComments.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No comments found"));
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, videoComments, "All comments fetched successfully"));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new ApiError(500, "Internal server error while fetching comments");
    }
  });
  

const getComment  = AsyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found in the database ")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment successfully obtain")
    )
})

const addComments= AsyncHandler( async (req,res)=>{
    console.log("addComments controller triggered")
        const {videoId} = req.query
        const {content}  = req.body
        const user = req.user?._id

        const userName = await User.findById(user)
        console.log("username",userName)
        if(!userName){
            throw new ApiError(404,"user not found ")
        }

        
        if(!content || content.trim().length==0 ){
            throw new ApiError(402,"please enter comment ")
        }
        if(!user){
            throw new ApiError(401,"unauthorized request")
        }

        if(videoId){
            const video = await Video.findById(videoId)
            if(!video){
                throw new ApiError(402,"video not found")
            }
        }
        let newComment;
        
         try {
            newComment = await Comment.create({
               content,
               owner:userName.userName.toString(),
               video: videoId || undefined,
           })
            const commentCount = await Comment.countDocuments({video:videoId})
            return res
            .status(200)
            .json(
            new ApiResponse(200,{commentCount,newComment},"comment successfully done!")
            )

         } catch (error) {
            console.log("something went wrong !!",error.message)
            throw new ApiError(500,"something went wrong")
         }
         
})

const deleteComment = AsyncHandler( async (req,res)=>{
    const user  = req.user?._id
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(401,"please provide comment id ")
    }
    if(!user){
        throw new ApiError(401,"unauthorized request ")
    }
    const comment = await Comment.findById(commentId)
    console.log("comment for delete",comment)
    console.log("comment:",comment)
    if(!comment){
        throw new ApiError(401,"comment not found in the database ")
    }

    if(user.toString() !== comment.owner.toString() ){
        throw new ApiError(401,"this is not your comment")
    }
    await Comment.deleteOne({_id:commentId})
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"comment deleted successfully")
    )

})

const updateComent = AsyncHandler( async (req,res)=>{
    const {commentId} = req.params
    const {content}  = req.body
    const user = req.user?._id
    if(!user){
        throw new ApiError(401,"unauthorized request")
    }
    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"please provide comment Id ")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found in the database")
    }
    if(user.toString() !== comment.owner.toString()){
        throw new ApiError(403,"there is no comments of yours ")
    }
    comment.content = content
    await comment.save()
    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment updated successfully!")
    )

})

export {getAllComments,addComments,deleteComment,updateComent,getComment}