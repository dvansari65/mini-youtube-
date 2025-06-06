import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"User"
    },
    
},{timeseries:true})

export const Subscription = mongoose.model("subscription",subscriptionSchema)