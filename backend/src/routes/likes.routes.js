import {toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getAllLikedVideos,
    totalUserVideoslikes
} from "../controllers/likes.controller.js"
import { Router } from "express"
import verifyJwt from "../middlewares/user.middleware.js"
const likesRouter = Router()

likesRouter.route("/toggle-video-like/:videoId").post(verifyJwt,toggleVideoLike)
likesRouter.route("/toggle-comment-like/:commentId").post(verifyJwt,toggleCommentLike)
likesRouter.route("/toggle-tweet-like/:tweetId").post(verifyJwt,toggleTweetLike)
likesRouter.route("/get-all-liked-videos").get(verifyJwt,getAllLikedVideos)
likesRouter.route("/total-likes-off-user-channel-videos").get(verifyJwt,totalUserVideoslikes)

export {likesRouter}