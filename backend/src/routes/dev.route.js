import { Router } from "express";
import {resetVideoLikes,resetSubscription} from "../controllers/devOption.js";
const devRouter  = Router()

devRouter.route('/dev-option-resetVideoLikes').delete(resetVideoLikes)
devRouter.route('/dev-option-resetSubscription/:userId').delete(resetSubscription)

export{devRouter}