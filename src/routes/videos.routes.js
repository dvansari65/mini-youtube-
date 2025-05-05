import {
    uploadVideosContent,
    watchVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    getAllVideos
} from "../controllers/video.controller.js"
import verifyJwt from "../middlewares/user.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { Router } from "express"

const videoRouter = Router()

videoRouter.route("/upload-content").post(upload.array("videos"),verifyJwt,uploadVideosContent)
videoRouter.route("/update-video/:videoId").patch(verifyJwt,updateVideo)
videoRouter.route("/watch-video/:videoId").get(verifyJwt,watchVideo)
videoRouter.route("/delete-video/:videoId").delete(verifyJwt,deleteVideo)
videoRouter.route("/get-video/:videoId").get(verifyJwt,getVideo)
videoRouter.route("/get-all-video").get(verifyJwt,getAllVideos)

export {videoRouter}