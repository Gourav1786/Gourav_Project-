 const ErrorHandler= require('../ErrorHandler/ErrorHandler');
module.exports=(err,req,res,next)=>{
     err.message=err.message||`internal Server Error`;
      err.statusCode=err.statusCode||500
      if(err.name==="CastError")
      {
           const message= `Resource not Found:invalid ${err.path}`
           err= new ErrorHandler(message,400);
      }
      if(err.code===11000)
      {
           const message=`Duplicate Value ${Object.keys(err.keyValue)} Enterd`
            err= new ErrorHandler(message,400)
      }
       if(err.name==='JsonWebToenWebError')
       {
           const message="Json Web Token is Invalid,Try Again"
           err= new ErrorHandler(message,400)
       }
        if(err.name==='TokenExpire')
        {
          const message="Json Web Token is Expire,Try Again"
           err= new ErrorHandler(message,400)
           
        }
      
      res.status(err.statusCode).json({
        sucess:false,
        message:err.message
    })
}