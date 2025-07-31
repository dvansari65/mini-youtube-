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
                },
                {
                    new:true
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
    
   const {channelId} = req.params
    
    if(!channelId){
        throw new ApiError(404,"user not found ")
    }
    const [subscribers,numberOfSubscriber] = await Promise.all([
        Subscription.find({channel:channelId}),
        Subscription.countDocuments({channel:channelId})
    ]) 
   
    if(!subscribers){
        throw new ApiError(404,"there is no any subscriber of this channel ")
    }
    
    if(numberOfSubscriber == undefined){
        throw new ApiError(404," subscriber Count can not be count")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{numberOfSubscriber,subscribers},"your subscribers are here")
    )
})

const getSubcribedChannel = AsyncHandler( async (req,res)=>{
    const user = req.user._id
    if(!user){
        throw new ApiError(404,"user not found")
    }
    const [subscribedChannel,countSubscribedToChannel] = await Promise.all([
        Subscription.find({subscriber:user}).populate("channel","userName avatar"),
        Subscription.countDocuments({subscriber:user})
    ])
    
    if(!subscribedChannel){
        throw new ApiError(404,"there is no any channel you subscribed")
    }
    if(countSubscribedToChannel== undefined){
        throw new ApiError(404,"countSubscribedChannel is undefined")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{countSubscribedToChannel,subscribedTo:subscribedChannel},"here is your subscribed channel")
    )
})

const subscribeStatus = AsyncHandler( async(req,res)=>{
    const {channelId} = req.params
    const user = req.user._id
    try {
        if(!user ||channelId){
            new ApiError(404,"please provide channel id or user id")
        }
        const isSubscribed = await Subscription.findOne({
            channel:channelId,
            subscriber:user
        })

        if(isSubscribed){
            return res
            .status(200)
            .json(
                new ApiResponse(200,{subscribed:true},"user already subscribed it")
            )
        }
        if(!isSubscribed){
            return res
            .status(200)
            .json(
                new ApiResponse(200,{subscribed:false},"user not  subscribed it")
            )
        }
        if(channelId == user){
            return res
            .status(200)
            .json(
                new ApiResponse(200,{subscribed:!!isSubscribed},"user toggle subscribe")
            )
        }
    } catch (error) {
        console.error("error while checking the status",error)
        throw new ApiError(500,"error while checking the statu")
    }
})
export {toggleSubscription,getChannelSubcribers,getSubcribedChannel,subscribeStatus}