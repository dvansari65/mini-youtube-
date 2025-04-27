class ApiResponse {
    constructor (
        statusCode,
        data,
        message
    ){
        this.data = data
        this.statusCode = statusCode 
        this.success = statusCode < 400
        this.message = message
    }
}