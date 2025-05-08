import  {
    createPlayList,
    addVideosToThePlaylist,
    removeVideoFromPlayList,
    updatePlayList,
    deletePlayList,
    getUserPlayList} from "../controllers/playlist.controller.js"
import verifyJwt from "../middlewares/user.middleware.js";
import { Router } from "express";

const playListRouter = Router()
playListRouter.route("/create-playlist").post(verifyJwt,createPlayList)
playListRouter.route("/add-videos/:PlayListId/:videoId").post(verifyJwt,addVideosToThePlaylist)
playListRouter.route("/remove-video/:playListId/:videoId").delete(verifyJwt,removeVideoFromPlayList)
playListRouter.route("/update-playlist/:playListId").patch(verifyJwt,updatePlayList)
playListRouter.route("/delete-playlist/:playListId").delete(verifyJwt,deletePlayList)
playListRouter.route("/get-user-playlist").get(verifyJwt,getUserPlayList)



export { playListRouter}