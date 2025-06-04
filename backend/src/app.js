import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express()
app.use(cors({
    origin:"http://localhost:5173",
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
import {subscriptionRouter} from "./routes/subscription.route.js"
import {dashboardRouter} from "./routes/dashboard.routes.js"
import { devRouter } from "./routes/dev.route.js"
    app.use("/api/v1/users",userRouter)
    app.use("/api/v1/videos",videoRouter)
    app.use("/api/v1/likes",likesRouter)
    app.use("/api/v1/comments",commentRouter)
    app.use("/api/v1/playList",playListRouter)
    app.use("/api/v1/tweet",tweetRouter)
    app.use("/api/v1/subscription",subscriptionRouter)
    app.use("/api/v1/dashboard",dashboardRouter)
    app.use("/api/v1/devOption",devRouter)
 export default app