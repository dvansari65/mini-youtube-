import {getAllComments,addComments,deleteComment,updateComent,getComment} from "../controllers/comment.controller.js"
import { Router } from "express"

import verifyJwt from "../middlewares/user.middleware.js"

const commentRouter = Router()

commentRouter.route("/add-comment").post(verifyJwt,addComments)
commentRouter.route("/delete-comment/:commentId").delete(verifyJwt,deleteComment)
commentRouter.route("/get-all-comment").get(verifyJwt,getAllComments)
commentRouter.route("/get-comment/:commentId").get(verifyJwt,getComment)
export {commentRouter}