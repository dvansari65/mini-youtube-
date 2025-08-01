import { Video } from "../models/video.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import fs from "fs"
import imagekit from "../imagekit/imagekit.js";
import { deleteFileFromImagekit } from "../utils/deleteHandler.js";


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
    const {title,description,duration,isPublished}  = req.body
    const user = req.user?._id
    const thumbNail = req.files?.thumbNail?.[0]
    const videoFile = req.files?.videos?.[0]
   
    if(!thumbNail || !videoFile){
      throw new ApiError("thumbnail or videofile is missing!",411)
    }
    if(!title || !description || !duration || !isPublished){
      throw new ApiError("please provide all the fields!",411)
    }
    const uploadedThumbNail = await imagekit.upload({
      file:fs.readFileSync(thumbNail?.path),
      fileName : thumbNail?.originalname
    })
    const uploadedVideoFile = await imagekit.upload({
      file:fs.readFileSync(videoFile?.path),
      fileName:videoFile?.originalname
    })
    if(!uploadedThumbNail || !uploadedVideoFile){
      throw new ApiError("failed t upload video!",500)
    }
    const video = await Video.create({
      title,
      description,
      duration,
      isPublished,
      thumbNail:uploadedThumbNail.url,
      thumbNailFileId: uploadedThumbNail.fileId,
      videoFile:uploadedVideoFile.url,
      videoFileId:uploadedVideoFile.fileId,
      owner:user
    })
    if(!video){
      throw new ApiError("failed to create video!",500)
    }
    return res.status(200).json(
      new ApiResponse(200,{
        message:"video uplaoded successfully!",
        success:true,
        video
      })
    )

})

const watchVideo = AsyncHandler(async (req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(401,"please provide video id")
    }

    const video =  await Video.findById(videoId).populate("owner","userName")
    if(!video){
        throw new ApiError(404,"video not found")
    }
    video.views = (video.views || 0) + 1;
    await video.save({validateBeforeSave:false})

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
                likes:video.likes.length || 0
            },
            "video watched by user"
        )
    )
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { title, description, thumbNail } = req.body;
    const { videoId } = req.params;
    const user = req.user?._id
    if(!user){
      throw new ApiError(400,"please logged in!")
    }
    if (!videoId ) {
      throw new ApiError(400, "Video ID is required");
    }
  
    if (!title && !description && !thumbNail) {
      throw new ApiError(
        400,
        "At least one field (title, description, or thumbnail) is required to update"
      );
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found in the database");
    }
    if (video.owner.toString() !== user.toString()) {
      throw new ApiError(403, "You are not authorized to update this video");
    }
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
   if(!videoId){
    throw new ApiError(400,"invalid request")
   }

   const video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(401,"video not found in database")
   }

   if(video.owner?.toString() !== user?.toString()){
    throw new ApiError(404,"invalid user")
   }

   try {
    await Video.findByIdAndDelete(videoId)
    await deleteFileFromImagekit(video?.videoFileId)
    await deleteFileFromImagekit(video?.thumbNailFileId)
    return res
      .status(200)
      .json(
      new ApiResponse(
        200,
        {},
        "video deleted successfully"
      )
    )
   } catch (error) {
    console.error("Error deleting video:", error.message);
    throw new ApiError(500, "Something went wrong");
   }
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