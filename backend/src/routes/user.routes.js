import { Router } from "express"
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser,
  logOutUser,
  refreshTokenForUser,
  changeUserPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getWatchHistory,
  getUserChannelProfile ,
  getCurrentUser,
  } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/user.middleware.js";
const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
  );
  
  
  userRouter.route("/register").post(registerUser)
  userRouter.route("/login").post(loginUser)
  userRouter.route("/logout").post(verifyJwt,logOutUser)
  userRouter.route("/Refresh-Token").post(verifyJwt,refreshTokenForUser)
  userRouter.route("/update-Account").patch(verifyJwt,updateAccountDetails)
  userRouter.route("/update-Avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar)
  userRouter.route("/update-Cover-Image").patch(verifyJwt,upload.single("coverImage"),updateCoverImage)
  userRouter.route("/watch-history").get(verifyJwt,getWatchHistory)
  userRouter.route("/c/:userName").get(verifyJwt,getUserChannelProfile)
  userRouter.route("/get-current-user").get(verifyJwt,getCurrentUser)
  userRouter.route("/change-password").patch(verifyJwt,changeUserPassword)
export default userRouter;