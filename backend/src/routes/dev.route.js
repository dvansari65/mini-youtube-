import { Router } from "express";
import resetVideoLikes from "../controllers/devOption.js";
const devRouter  = Router()

devRouter.route('/dev-option').delete(resetVideoLikes)

export{devRouter}