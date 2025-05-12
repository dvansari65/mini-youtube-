
import {addTweet,deleteTweet,getAllTweets,updateTweet} from "../controllers/tweet.controller.js"

import verifyJwt from "../middlewares/user.middleware.js"
import { Router } from "express"

const tweetRouter = Router()

tweetRouter.route("/add-tweet").post(verifyJwt,addTweet)
tweetRouter.route("/get-all-tweets").get(verifyJwt,getAllTweets)
tweetRouter.route("/update-tweet/:tweetId").patch(verifyJwt,updateTweet)
tweetRouter.route("/delete-tweet/:tweetId").delete(verifyJwt,deleteTweet)
export {tweetRouter}