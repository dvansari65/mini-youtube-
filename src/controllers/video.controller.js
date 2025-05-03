import { Video } from "../models/video.models";
import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";
import { User } from "../models/user.models";
import ApiResponse from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import fs from "fs"
const uploadVideosContent = AsyncHandler ( async (req,res)=>{
    const {thumbNail,title,description}  = req.body
    const videoLocalPath = req.files?.path

    if(!videoLocalPath){
        throw new ApiError(401,"please provide video local path")
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath)
    console.log("Uploaded video details:", uploadedVideo);

    if(!uploadedVideo){
      if(fs.existsSync(videoLocalPath)){
        fs.unlinkSync(videoLocalPath)
    }
      throw new ApiError(401,"video not uploaded on the cloudinary")
    }

    if(!thumbNail || !title || !description){
        throw new ApiError(401,"all fields are required!")
    }

    const user  = req.user?._id
    console.log("Owner (user ID):", user);
    if(!user){
        throw new ApiError(404,"user not found")
    }

    const isUserCorrect = await User.findById(user)
    if(!isUserCorrect){
        throw new ApiError(404,"user not found")
    }

    console.log("req.files data >",req.files)

    let videosDetailsFromUser;
    try {
     videosDetailsFromUser =  await Video.create({
         thumbNail:req.body.thumbNail,
         title:req.body.title,
         description:req.body.description,
         owner : user,
         videoFile:uploadedVideo
     })
    } catch (error) {
        throw new ApiError(500,"video not uploaded ")
    }
    console.log("Video saved to database:", videosDetailsFromUser);

    if(!videosDetailsFromUser){
        throw new ApiError(400,"fill all the information")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,videosDetailsFromUser,"content uploaded successfully!")
    )

})

const watchVideo = AsyncHandler(async (req,res)=>{
    const videoID = req.params.id
    console.log("req.params:",req.params)
    if(!videoID){
        throw new ApiError(401,"something is wrong with video")
    }

    const video =  await Video.findById(videoID).populate("owner","userName")

    video.views = (video.views || 0) + 1;

    await video.save({validateBeforeSave:false})
    console.log("video data:",video)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                userName:video.userName,
                title:video.title,
                description:video.description,
                owner:video.owner,
                views:video.views
            },
            "video watched by user"
        )
    )
})

const updateVideo = AsyncHandler( async (req,res)=>{
    const {title,description,thumbnail} = req.body
    const videoId = req.params.id
    if(!videoId){
        throw new ApiError(404,"please select the video")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found in the database")
    }
    const user = req.user?._id
    if(!user){
    throw new ApiError(404,"user not found")
    }
    if(video.owner.toString() !== user.toString()){
        throw new ApiError(401,"unauthorized request")
    }
    let savedUpdates;
    try {
        if(title) video.title = title;
        if(description) video.description = description;
        if(thumbnail) video.thumbnail = thumbnail;
    
        savedUpdates = await video.save({validateBeforeSave:false})
    } catch (error) {
        throw new ApiError(500,"failed to save updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            savedUpdates,
            "updates have been saved"
        )
    )
})

const deleteVideo = AsyncHandler (async (req,res)=>{
   const videoId = req.params.id
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
    throw new ApiError(500,"something is wrong")
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


export {
    uploadVideosContent,
    watchVideo,
    updateVideo,
    deleteVideo,
} 