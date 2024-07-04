const ErrorHandler = require("../ErrorHandler/ErrorHandler");
const authorizerole = (...roles)=>
{
   return(req,res,next)=>{
     if(!roles.includes(req.user.role))
     {
         return next(new ErrorHandler(`this role ${req.user.role} is no allowedthis resource`,403));
     }
     next();
   }

}
module.exports= authorizerole;