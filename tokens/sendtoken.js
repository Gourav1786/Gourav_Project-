// const { startSession } = require("../Schema/UserSchema");
  const cookie= require('cookie-parser')

const sendtoken= async(result,status,res)=>{

     const token= await result.generateAuthToken();
      const option= {
        expire:new Date(Date.now()*process.env.Cookie_Expire*24*60*60*1000),
         httpOnly:true
      }
     return res.status(status).cookie('token',token,option).json({
       sucess:true,
       result,token
       
     });
     
}
module.exports= sendtoken;