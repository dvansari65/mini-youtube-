import jwt from "jsonwebtoken";

import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    userName:{
        type:String,
        required:[,"username is required!!"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:[,"email is required"],
        lowercase:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    coverImage:{
        type:String,
    },
    avatar:{
        type:String,
    },
    likedVideosByUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type:String,
    },
    subscriberCount:{
        type:Number,
        default:0
    }
},{timestamps : true})

userSchema.pre("save",async function (next){
   if(! this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password){
        
    return  await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken =  function (){
        return jwt.sign({
            _id: this._id,
            fullName : this.fullName,
            email:this.email,
            password:this.password,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken =  function (){
   return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET ,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export const User =  mongoose.model("User",userSchema)