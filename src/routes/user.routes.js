import { Router } from "express"
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser,logOutUser,refreshTokenForUser,updateAccountDetails,updateAvatar,updateCoverImage } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/user.middleware.js";
const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
  );
  userRouter.route("/login").post(loginUser)
  userRouter.route("/logout").post(verifyJwt,logOutUser)
  userRouter.route("/Refresh-Token").post(verifyJwt,refreshTokenForUser)
  userRouter.route("/update-Account").post(verifyJwt,updateAccountDetails)
  userRouter.route("/update-Avatar").post(verifyJwt,updateAvatar)
  userRouter.route("/update-Cover-Image").post(verifyJwt,updateCoverImage)

export default userRouter;