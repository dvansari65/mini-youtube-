import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import {User} from "../models/user.models.js"

const toggleSubscription = AsyncHandler(async (req, res) => {
    const { channelId } = req.query;
    const user = req.user._id;
    if(!channelId || !user){
       throw new ApiError(400,"user id or channel id not provided")
    }
    try {

        const subscription = await Subscription.findOne({
            channel:channelId,
            subscriber:user
        })
        if(!subscription){
             await Subscription.create(
                {
                    channel:channelId,
                    subscriber:user,
                }
            )
            const updatedChannel = await User.findByIdAndUpdate(
                channelId,
                {$inc:{subscriberCount:1}},
                {new:true}
            )
            return res
            .status(200)
            .json(
                new ApiResponse(200,{isSubscribed:true,subscribeCount:updatedChannel.subscriberCount},"channel subscribed successfully")
            )
        }else{
            await Subscription.deleteOne(
                {
                    channel:channelId,
                    subscriber:user,
                }
            )
            const currentChannel = await User.findById(channelId);
            const newCount = Math.max((currentChannel.subscriberCount || 0) - 1, 0);
      
            const updatedChannel = await User.findByIdAndUpdate(
              channelId,
              { subscriberCount: newCount },
              { new: true }
            );
            return res
            .status(200)
            .json(
                new ApiResponse(200,{isSubscribed:false,subscribeCount:updatedChannel.subscriberCount},"channel unSubscribed successfully")
            )

        }
        
    } catch (error) {
        console.error("something went wrong while toggling the subscription",error)
        throw new ApiError(500,"something went wrong while toggling the subscription")
    }
});


const getChannelSubcribers = AsyncHandler( async (req,res)=>{
    
    const user = req.user
    
    if(!user){
        throw new ApiError(404,"user not found ")
    }
    console.log("user:",user)
    const subcribersOfChannel = await Subscription.find({channel:user})
   
    
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
    const subscribedChannel = await Subscription.find({subcriber:user}).populate("channel","userName avatar")
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
const isSubscribed = AsyncHandler( async(req,res)=>{
    const user = req.user?._id
    const {channelId} = req.query
    console.log("channel id:",channelId)
    console.log("user:",user)
    if( !channelId){
        throw new ApiError(404," channelId is missing")
    }
    if(!user){
        throw new ApiError(404,"user is missing ")
    }
    const existingSubscription = await Subscription.findOne({subcriber:user,channel:channelId})
    if(channelId == user){
        new ApiResponse(200,{subscribed:!!existingSubscription},"subscription status")
    }
    return res.status(200).json(
        new ApiResponse(200,{subscribed:!!existingSubscription},"subscription status")
    )
    
})
export {toggleSubscription,getChannelSubcribers,getSubcribedChannel,isSubscribed}