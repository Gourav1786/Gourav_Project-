const jwt= require('jsonwebtoken');
const user= require('../Schema/UserSchema');
const CatchAsyncError= require('./CatchAsyncError');
const ErrorHandler = require('../ErrorHandler/ErrorHandler');
const authentication=CatchAsyncError(async(req,res,next)=>{
  const token = req.headers['authorization']?.split(' ')[1];
  //  const {token}= req.cookies;
         
        console.log(token);
        if(!token)
        {
             return next(new ErrorHandler("please Login And Access this route",401));

        }
          const decodedata= jwt.verify(token,process.env.SECRET_KEY)
          req.user= await user.findById(decodedata.id);
          next();
        })
 module.exports= authentication;  
 
  // module.exports=authorizerole;