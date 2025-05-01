import { Router } from "express"
import registerUser from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser,logOutUser,refreshTokenForUser } from "../controllers/user.controller.js";
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
  userRouter.route("/RefreshToken").post(refreshTokenForUser)

export default userRouter;