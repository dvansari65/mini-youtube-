import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subcriber:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"User"
    }
},{timeseries:true})

export const subscription = mongoose.model("subscription",subscriptionSchema)