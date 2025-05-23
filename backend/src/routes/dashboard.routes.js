import {getChannelStats,getTotalVideos} from "../controllers/dashboard.controller.js"

import verifyJwt from "../middlewares/user.middleware.js"
import { Router } from "express"

const dashboardRouter = Router()

dashboardRouter.route("/get-channel-stats").get(verifyJwt,getChannelStats)
dashboardRouter.route("/get-total-videos").get(verifyJwt,getTotalVideos)

export {dashboardRouter}