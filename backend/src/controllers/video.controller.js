import { Video } from "../models/video.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"


const searchVideos = AsyncHandler( async(req,res)=>{
      const query = req.query.q || ""
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = ( page - 1 )*limit
      try {
        const filter  = {
          $or:[
            {title: { $regex: query, $options: 'i' }},
            {description: { $regex: query, $options: 'i' }}
          ]
        }
        const countVideos = await Video.countDocuments(filter)
        const videos = await Video.find(filter)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("owner")

        if(videos.length == 0){
          return res
          .status(404)
          .json(
            new ApiResponse(404,videos,"videos not found")
          )
        }
        return res
        .status(200)
        .json(
          new ApiResponse(200,{videos:videos,countVideos:countVideos},"videos fetched successfully")
        )

      } catch (error) {
        console.error("failed to fetched videos:",error)
        new ApiError(404,"error while fetching the videos")
      }

      
      
})

const uploadVideosContent = AsyncHandler ( async (req,res)=>{
    // const {title,description,duration,isPublished}  = req.body

    // if (!req.files || req.files.length === 0) {
    //     throw new ApiError(401, "Please provide video file(s)");
    //   }
    // const thumbnailLocalPath = req.files.thumbNail?.[0]?.path;

    // if(!thumbnailLocalPath){
    //     throw new ApiError(401,"please provide thumbnail local path")
    // }
    // const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath,"image")
    // try {
    //     if(!uploadedThumbnail || !uploadedThumbnail.url){
    //       if(fs.existsSync(thumbnailLocalPath)){
    //         fs.unlinkSync(thumbnailLocalPath)
    //       }
    //     }
    // } catch (error) {
    //     console.error("Failed to delete local file:", error.message);
    // }  


    // const videoLocalPath = req.files.videos?.[0]?.path
    // console.log("videoLocalPath:",videoLocalPath)
    // if(!videoLocalPath){
    //     throw new ApiError(401,"please provide video local path")
    // }
   
    // const uploadedVideo = await uploadOnCloudinary(videoLocalPath,"video")
    // console.log("Uploaded video details:", uploadedVideo);

    // try {
    //     if(!uploadedVideo || !uploadedVideo.url){
    //       if(fs.existsSync(videoLocalPath)){
    //         fs.unlinkSync(videoLocalPath)
    //       }
    //     }
    // } catch (error) {
    //     console.error("Failed to delete local file:", error.message);
    // }

    // if( !title || !description || !duration){
    //     throw new ApiError(401,"all fields are required!")
    // }

    // const user  = req.user?._id
    // console.log("Owner (user ID):", user);
    // if(!user){
    //     throw new ApiError(404,"user not found")
    // }

    // const isUserCorrect = await User.findById(user)
    // if(!isUserCorrect){
    //     throw new ApiError(404,"user not found")
    // }

    // console.log("req.files data >",req.files)

    // let videosDetailsFromUser;
    // try {
    //  videosDetailsFromUser =  await Video.create({
    //      thumbNail:uploadedThumbnail.url,
    //      title:req.body.title,
    //      description:req.body.description,
    //      owner : user,
    //      duration,
    //      videoFile:uploadedVideo.url,
    //      isPublished:isPublished || false,
    //  })

    // } catch (error) {
    //     throw new ApiError(500,"video not uploaded ")
    // }
    // console.log("Video saved to database:", videosDetailsFromUser);

    // if(!videosDetailsFromUser){
    //     throw new ApiError(400,"fill all the information")
    // }

    // return res
    // .status(200)
    // .json(
    //     new ApiResponse(200,videosDetailsFromUser,"content uploaded successfully!")
    // )

})

const watchVideo = AsyncHandler(async (req,res)=>{
    const {videoId} = req.params

    console.log("req.params:",req.params)
    if(!videoId){
        throw new ApiError(401,"please provide video id")
    }

    const video =  await Video.findById(videoId).populate("owner","userName")
    if(!video){
        throw new ApiError(404,"video not found")
    }
    console.log("owner",video.owner)
    const user = await User.findById(video.owner._id)
    if(!user){
      throw new ApiError(404,"user not found")
    }
    console.log("user:",user)
    video.views = (video.views || 0) + 1;

    await video.save({validateBeforeSave:false})
    console.log("video data:",video)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                userName:video.owner.userName,
                title:video.title,
                description:video.description,
                owner:video.owner,
                views:video.views,
                videoFile:video.videoFile,
                thumbNail:video.thumbNail,
                avatar:user.avatar || null,
                likes:video.likes.length || 0
            },
            "video watched by user"
        )
    )
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { title, description, thumbNail } = req.body;
    const { videoId } = req.params;
    const user = req.user?._id;
  
    // Check if videoId and at least one field to update are provided
    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }
  
    if (!title && !description && !thumbNail) {
      throw new ApiError(
        400,
        "At least one field (title, description, or thumbnail) is required to update"
      );
    }
  
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }
  
    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found in the database");
    }
  
    // Check if user is the owner
    if (video.owner.toString() !== user.toString()) {
      throw new ApiError(403, "You are not authorized to update this video");
    }
  
    // Prepare update object with only provided fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (thumbNail) updateData.thumbNail = thumbNail;
  
    try {
      const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, {
        new: true,
        runValidators: true, 
      });
  
      if (!updatedVideo) {
        throw new ApiError(500, "Video update failed");
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
    } catch (error) {
      console.error("Video update failed:", error.message);
      throw new ApiError(500, "Internal server error while updating video");
    }
  });
  
const deleteVideo = AsyncHandler (async (req,res)=>{
   const {videoId} = req.params
   const user = req.user?._id
   console.log("req.file.path:",req.file?.path)
   if(!videoId){
    throw new ApiError(400,"invalid request")
   }

   const video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(401,"video not found in database")
   }

   if(video.owner.toString() !== user.toString()){
    throw new ApiError(404,"invalid user")
   }

   try {
    await Video.deleteOne(video)
   } catch (error) {
    console.error("Error deleting video:", error.message);
    throw new ApiError(500, "Something went wrong");
   }

   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        {},
        "video deleted successfully"
    )
   )

})
const getVideo = AsyncHandler ( async (req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(401,"video not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(401,"video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video succssfully found"
        )
    )
})

const getAllVideos = AsyncHandler ( async (req,res)=>{
   
    const videos = await Video.find().populate("owner","userName")
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "request accepted successfully"
        )
    )
})

const MyVideos = AsyncHandler( async(req,res)=>{
    const user = req.user?._id
    if(!user){
      console.error("unauthorized req",error)
      throw new ApiError(400,"unauthorized request")
    }
    try {
      const myVideos = await Video.find({owner:user}).sort({createdAt:-1})
      return res
      .status(200)
      .json(
        new ApiResponse(200,myVideos,"your videos successfully fetched")
      )
    } catch (error) {
      console.error("videos not found",error)
    }
})


export {
    uploadVideosContent,
    watchVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    getAllVideos,
    searchVideos,
    MyVideos
} 