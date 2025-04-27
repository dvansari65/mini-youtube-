class ApiError extends Error {
    constructor(
        message="something went wrong",
        errors = [],
        statusCode,
        stack="",
    ){
        super(message)
        this.errors = errors
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        if(stack){
            this.stack = stack
        }else{
            errors.captureStackTrace(this,this.constructor)
        }
    }
}

export default ApiError