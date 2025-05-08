import ApiError from "../utils/ApiError.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import { Comment } from "../models/comment.models.js"
import { Video } from "../models/video.models.js"
import {Tweet} from "../models/tweet.models.js"
import ApiResponse from "../utils/ApiResponse.js"


const getAllComments = AsyncHandler( async (req,res)=>{
   const {videoId,tweetId} = req.query
   const user = req.user?._id
    
   let comments =[]
   if(!videoId && !tweetId){
    throw new ApiError(401,"please provide video Id or tweet Id ")
   }
   if(!user){
    throw new ApiError(401,"unauthorized request ")
   }
   if(videoId){
        comments = await Comment.find({video:videoId}).populate("owner","userName").sort({ createdAt: -1 })
       
       console.log("coments data:",comments)
       if(comments.length==0){
         throw new ApiError(404,"there is no such video Id in the data base for this video ")
       }
   }else if(tweetId){
     comments = await Comment.find({tweet:tweetId}).populate("owner","userName").sort({ createdAt: -1 })
   
    if(comments.length===0){
        throw new ApiError(404,"there is no such tweet Id in the data base for this tweet ")
      }
   }

   return res
   .status(200)
   .json(
        new ApiResponse(200,comments,"comments fetched succesfully")
   )

  
})
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
        const {videoId, tweetId} = req.query
        const {content}  = req.body
        const user  = req.user?._id

        if(!videoId && !tweetId){
            throw new ApiError(402,"Please provide either a video ID or a tweet ID ")
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
        }else if(tweetId){
            const comment  = await Tweet.findById(tweetId)
            if(!comment){
                throw new ApiError(402,"comment not found")
            }
        }
        let newComment;
         try {
            newComment = await Comment.create({
               content,
               owner:user,
               video: videoId || undefined,
               tweet: tweetId || undefined,
           })
         } catch (error) {
            console.log("something went wrong !!",error.message)
            throw new ApiError(500,"something went wrong")
         }
         return res
         .status(200)
         .json(
            new ApiResponse(200,newComment,"comment successfully done!")
         )
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
    if(!commentId){
        throw new ApiError(400,"please provide comment Id ")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found in the database")
    }
    if(user.toString() !== comment.owner.toString()){
        throw new ApiError(403,"there is no comments of yours ")
    }
    const updatedComment = await Comment.updateOne(
      {  _id:comment?._id},
      {
        $set:{
            content:content
        }
      },
      {
        new:true
      }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedComment,"comment updated successfully!")
    )

})

export {getAllComments,addComments,deleteComment,updateComent,getComment}