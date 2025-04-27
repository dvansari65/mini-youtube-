const AsyncHandler = async (requestHandler)=>{
        (req,res,next)=>{
            Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
        }
}

export default AsyncHandler