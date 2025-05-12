import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import ApiResponse from "../utils/ApiResponse.js";


const toggleSubscription = AsyncHandler( async(req,res)=>{

    const {channelId} = req.query
    const user = req.user._id
    console.log("user:",user)
    
   if(!user){
    throw new ApiError(404,"user not provide")
   }
   try {
    const existingSubscription = await Subscription.findOne({subcriber:user,channel:channelId})
    if(!existingSubscription){
        await Subscription.create({
            subcriber:user,
            channel:channelId
        })
        return res.status(200).json(new ApiResponse(200,{},"channel subscribed"))
    }else{
        
        await Subscription.findOneAndDelete({
            subcriber:user,
            channel:channelId
        })
        return res.status(200).json(new ApiResponse(200,{},"channel unsubscribed"))
    }
   } catch (error) {
    console.log("something went wrong",error.stack)
    throw new ApiError(500,"something went wrong")
   }
})

const getChannelSubcribers = AsyncHandler( async (req,res)=>{
    const {channelId} = req.params
    const user = req.user._id
    if(!channelId){
        throw new ApiError(404,"please provide channel id ")
    }
    if(!user){
        throw new ApiError(404,"user not found ")
    }
    const subcribersOfChannel = await Subscription.find({channel:user}).populate("subscriber","userName")
    console.log("subcribersOfChannel:",subcribersOfChannel)
    if(!subcribersOfChannel){
        throw new ApiError(404,"there is no any subscriber of this channel ")
    }
    const subscriberCount = await Subscription.countDocuments({channel:user})
    if(subscriberCount== undefined){
        throw new ApiError(404," subscriber Count can not be count")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{subscriberCount,subcribers:subcribersOfChannel},"your subscribers are here")
    )
})

const getSubcribedChannel = AsyncHandler( async (req,res)=>{
    const user = req.user._id
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const subscribedChannel = await Subscription.find({subcriber:user}).populate("channel","userName")
    if(!subscribedChannel){
        throw new ApiError(404,"there is no any channel you subscribed")
    }
    const countSubscribedToChannel = await Subscription.countDocuments({subcriber:user})
    if(countSubscribedToChannel== undefined){
        throw new ApiError(404,"countSubscribedChannel is undefined")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{countSubscribedToChannel,subscribedTo:subscribedChannel},"here is your subscribed channel")
    )
})
export {toggleSubscription,getChannelSubcribers,getSubcribedChannel}