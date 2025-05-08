import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import{ tweetRouter} from "./routes/tweets.routes.js"
import { videoRouter } from "./routes/videos.routes.js"
import { likesRouter } from "./routes/likes.routes.js"
import {commentRouter} from "./routes/coments.routes.js"
import { playListRouter } from "./routes/playlist.routes.js"
    app.use("/api/v1/users",userRouter)
    app.use("/api/v1/videos",videoRouter)
    app.use("/api/v1/likes",likesRouter)
    app.use("/api/v1/comments",commentRouter)
    app.use("/api/v1/playList",playListRouter)
    app.use("/api/v1/tweet",tweetRouter)

 export {app}