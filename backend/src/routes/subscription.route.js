import {toggleSubscription,getChannelSubcribers,getSubcribedChannel,subscribeStatus} from "../controllers/subscription.controller.js"
import { Router } from "express"
import verifyJwt from "../middlewares/user.middleware.js"
const subscriptionRouter = Router()

subscriptionRouter.route("/toggle-subscription").post(verifyJwt,toggleSubscription)
subscriptionRouter.route("/get-channel-subscriber/:channelId").get(verifyJwt,getChannelSubcribers)
subscriptionRouter.route("/get-subscribed-channel").get(verifyJwt,getSubcribedChannel)
subscriptionRouter.route("/subscribe-status/:channelId").get(verifyJwt,subscribeStatus)
export {subscriptionRouter}