import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { PlayList } from "../models/playlist.models.js";

const createPlayList = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const user = req.user?._id;

  if (!title || !description) {
    throw new ApiError(401, " all fields are mandatory");
  }
  try {
    const createdPlayList = await PlayList.create({
      title: title,
      description: description,
      owner: user,
      new: true,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { createdPlayList },
          "playlist successfully created"
        )
      );
  } catch (error) {
    throw new ApiError("failed to create playlist!", 500);
  }
});

const addVideosToThePlaylist = AsyncHandler(async (req, res) => {
  const { videoId, PlayListId } = req.params;

  if (!videoId && !PlayListId) {
    throw new ApiError(400, "Video ID and Playlist ID are required");
  }

  const existingPlayList = await PlayList.findById(PlayListId);
  if (!existingPlayList) {
    throw new ApiError(404, "there is no such play list");
  }

  if (existingPlayList.videos.includes(videoId)) {
    throw new ApiError(401, "video is already in the playlist");
  }
  console.log("existingPlayList", existingPlayList);
  try {
    existingPlayList.videos.push(videoId);
    const updatedPlayList = await existingPlayList.save();

    if (!updatedPlayList) {
      throw new ApiError(402, "video is not uploaded in the playlist");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlayList, "playList updated successfully")
      );
  } catch (error) {
    console.error("Error adding video to playlist:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while adding the video to the playlist"
    );
  }
});

const removeVideoFromPlayList = AsyncHandler(async (req, res) => {
  const { playListId, videoId } = req.params;

  if (!playListId || !videoId) {
    throw new ApiError(400, "Missing playlist or video ID");
  }

  const existingPlayList = await PlayList.findById(playListId);

  if (!existingPlayList) {
    throw new ApiError(404, "Playlist not found");
  }

  // Use .equals() for ObjectId comparison
  const videoExists = existingPlayList.videos.some((v) => v.equals(videoId));

  if (!videoExists) {
    throw new ApiError(404, "Video not found in playlist");
  }

  try {
    const updatedPlaylist = await PlayList.findByIdAndUpdate(
      playListId,
      {
        $pull: { videos: videoId },
      },
      { new: true }
    ).populate("videos"); // Optional, to show updated video list

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Video removed successfully")
      );
  } catch (error) {
    console.error("Error removing video from playlist:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while removing the video from the playlist"
    );
  }
});

const updatePlayList = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { playListId } = req.params;
  if (!title && !description) {
    throw new ApiError(402, "enter something in the title and description");
  }
  if (!playListId) {
    throw new ApiError(401, "playList id is required");
  }
  try {
    const updatedPlayList = await PlayList.findByIdAndUpdate(
      playListId,
      {
        title: title,
        description: description,
      },
      {
        new: true,
      }
    );
    if (!updatedPlayList) {
      throw new ApiError(401, "playlist not updating for some reason");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlayList, "play list updated successfully ")
      );
  } catch (error) {
    console.error("Error while updating  playlist:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while updating  the playlist"
    );
  }
});

const deletePlayList = AsyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!playListId) {
    throw new ApiError(400, "please provide play list id");
  }

  try {
    await PlayList.findByIdAndDelete(playListId, {
      new: true,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "play list successfully deleted"));
  } catch (error) {
    console.error("Error while delete  playlist:", error.message);
    throw new ApiError(
      500,
      "Something went wrong while deleting  the playlist"
    );
  }
});

const getUserPlayList = AsyncHandler(async (req, res) => {
  const user = req.user?._id;
  if (!user) {
    throw new ApiError(401, "please logged in first!");
  }
  try {
    const allPlayLists = await PlayList.find({owner:user});
    if (!allPlayLists) {
      throw new ApiError(402, "there is no such playlist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { allPlayLists }, "your playList lists are here")
      );
  } catch (error) {
    console.error("error while retriving the playlist", error.message);
    throw new ApiError(
      500,
      "Something went wrong while  retriving the playlist"
    );
  }
});

const getSinglePlaylist = AsyncHandler(async (req, res) => {

  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(404, "please provide playlist id ");
  }
  const playlist = await PlayList.findById(playlistId).populate(
    "owner",
    "userName title description "
  );
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "you have got your playlist"));
});

export {
  createPlayList,
  addVideosToThePlaylist,
  removeVideoFromPlayList,
  updatePlayList,
  deletePlayList,
  getSinglePlaylist,
  getUserPlayList,
};
