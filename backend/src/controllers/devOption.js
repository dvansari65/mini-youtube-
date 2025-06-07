import { Like } from "../models/likes.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const resetVideoLikes = AsyncHandler(async (req ,res) => {
    try {
      // Step 1: Delete all video-related likes
      await Like.deleteMany({ video: { $exists: true } });
  
      // Step 2: Reset likesCount in all videos
      await Video.updateMany(
        {},
        {
          $set: {
            likesCount: 0,
            likes: []
          }
        }
      );
      
  
      return res.status(200).json(
        new ApiResponse(200, null, "All video likes reset successfully.")
      );
    } catch (error) {
      console.error("Error resetting likes:", error);
      throw new ApiError(500, "Failed to reset video likes");
    }
  });
  const resetSubscription = AsyncHandler( async (req,res)=>{
    const {userId} = req.params
    try {
      await Subscription.deleteMany({subscriber:userId})

      await User.updateMany({},{$set:{subscriberCount:0}})
      const user = await User.find({_id:userId})
      return res
      .status(200)
      .json(
        new ApiResponse(200,{user},"subscriber reseted")
      )
    } catch (error) {
      console.error("error while reseting the subscription",error)
      throw new ApiError("error while reseting the subscription")
    }
  })

  
  export  {resetVideoLikes,resetSubscription}