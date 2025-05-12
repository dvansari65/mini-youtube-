import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";



const addTweet = AsyncHandler( async (req,res)=>{
    const {content} = req.body
    const user = req.user?._id

    if(!content ){
        throw new ApiError(401,"type something in the comment")
    }
    if(!user){
        throw new ApiError(401,"unauthorized request")
    }
    const tweet = await Tweet.create({
        content:content,
        owner:user,
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"tweet successfully uploaded")
    )

})

const deleteTweet = AsyncHandler( async(req,res)=>{
    const {tweetId} = req.params
    const user = req.user?._id

    if(!tweetId){
        throw new ApiError(404,"tweet not found")
    }
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const tweet  = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found in the database")
    }
    if(tweet.owner.toString() !== user.toString()){
        throw new ApiError(401,"you can not delete this tweet")
    }
    await Tweet.deleteOne(
        {_id:tweetId},
        {new :true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"tweet successfully deleted")
    )
})

const getAllTweets  = AsyncHandler( async (req,res)=>{
    const user = req.user?._id
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const allTweets = await Tweet.find()
    return res
    .status(200)
    .json(
        new ApiResponse(200,allTweets,"found all tweets")
    )
})

const updateTweet = AsyncHandler(async(req,res)=>{
    const {content} = req.body
    const {tweetId} = req.params
    const user = req.user?._id
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(404,"tweet not found in the data base")
    }

    if(!content || typeof content !== "string" || content.trim().length==0){
        throw new ApiError(404,"please enter some content for tweet ")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found in the database")
    }
    
    await Tweet.updateOne(
        {
            _id:tweetId
        },
        {
            $set:{
                content:content
            }
        }
    )
    const updatedTweet = await Tweet.findById(tweetId).populate("owner","userName")
    if(!updatedTweet){
        throw new ApiError(404,"tweet not updated")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedTweet,"tweet updated successfully")
    )
})

export {addTweet,deleteTweet,getAllTweets,updateTweet}