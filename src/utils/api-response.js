class ApiResponse extends Response {
  constructor(
    statuscode, 
    data,
    message = "success"
    ){
        this.statuscode = statuscode, 
        this.data = data,
        this.message = message;
        this.success = statuscode < 400;
    }
}
