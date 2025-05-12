import { User } from "../models/user.models.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"

const verifyJwt = AsyncHandler( async (req,res,next)=>{
try {
    const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
     console.log("token  :",token)
 
     if(!token){
         throw new ApiError(401,"Unauthorized request !")
    }

    let decodedToken;
    try {
     decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401,"invalid access token")
    }

    console.log("decoded token:",decodedToken)
     const user =  await User.findById(decodedToken?._id).select(" -password -refreshToken")
     console.log("user info :" , user)
     if(!user){
     throw new ApiError(401 , "user not found")
     
    }
 
    req.user = user;
     next()
} catch (error) {
    console.error("JWT Verification failed:", error.message)
    throw error 
    }
})

export  default verifyJwt