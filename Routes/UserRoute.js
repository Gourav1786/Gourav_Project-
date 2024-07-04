const express= require('express');
const router=express.Router();
const bodyparser= require('body-parser'); 
 const userSche= require('../Schema/UserSchema');
  const sendtoken= require('../tokens/sendtoken');
  const ErrorHandler= require('../ErrorHandler/ErrorHandler');
const CatchAsyncError = require('../Middleware/CatchAsyncError');
const sendmail= require('../ErrorHandler/sendMail');
const crypto= require('crypto');
 const Authentication= require('../Middleware/isAuthenticated');
const bodyParser = require('body-parser');
const authorizerole= require('../Middleware/RoleAuthorizes');
const authentication = require('../Middleware/isAuthenticated');
 router.get('/user',(req,res)=>{
     res.json("hello Gourav Sharma");

 })
  // New User Register
    router.post('/Register',bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
        const user= await userSche.create(req.body);
        if(!user)
          {
        return next(new ErrorHandler("User not created",201))

          }   
           sendtoken(user,201,res);
        
    }))
  
  // Login user and admin
   router.post('/login',bodyparser.json(),CatchAsyncError(async(req,res,next)=>{
     const {email,password}= req.body;
      console.log(req.body);
      if(!email||!password)
      {
          return res.status(401).json({
             sucess:false,
             message:"please fill All field"
             
            })
            // return next (new ErrorHandler("please fill the field",401));
      }
        const result= await userSche.findOne({email}).select('+password');
        if(!result)
        {
            // res.status(201).json({
            //     sucess:false,
            //    message:"Invalid Details"
            // })
             return next (new ErrorHandler("Invalid Details",401));
        } 
        const result1= await result.comparPassword(password);
        if(!result1)
        {
            return next(new ErrorHandler("Invalid Details",401));
        }
        // const token= await result.generateAuthToken();
        sendtoken(result,200,res)

        // res.status(200).json({
        //     sucess:true,
        //      result,token
        // })
           
     
   }));
  //  Logout Account
    router.get('/LogOut',CatchAsyncError(async(req,res,next)=>{
      res.cookie('token',null,{
         expires:new Date(Date.now()),
          httpOnly:true
      })
       res.status(200).json({
          sucess:true,
           message:"Suceesfully Logout"
       })

    }))
    // Forgot password
     router.post('/forgot',CatchAsyncError(async(req,res,next)=>{
          
        const user= await userSche.findOne({email:req.body.email});
         if(!user)
         {
             return next(new ErrorHandler("User not found",404));

         }
           const resettoken= await user.resetPassword();
            await user.save({validateBeforeSave:true});
            const resetPasswordurl=`${req.protocol}://${req.get(
                "host",
            )}/reset/${resettoken}`;

            const message= `your password reset token is :- \n\n${resetPasswordurl}\n\n if you have not requested this email then please ignore it`;
               
             try{
                await sendmail({
                     email:user.email,
                      subject:"Ecommerce Password Recovery",
                      message
                })
                
                 res.status(200).json({
                     sucess:true,
                      message:`Email sent to${user.email} suceesfully`
                     
                 })

             }
             catch(err)
             {
                 user.resetPasswordToken=undefined;
                  user.ressetPasswordExpire= undefined;
                  await user.save({validateBeforeSave:false});
                 return next(new ErrorHandler(err.message,500));
             }
             }))

            //  Password Change without old password
              
            router.put('/reset/:token',bodyparser.json(),CatchAsyncError(async(req,res,next)=>{

              
                 const resetPasswordToken= crypto.Hash('sha256').update(req.params.token).digest('hex');
                 console.log(resetPasswordToken);
                  
                 const user= await userSche.findOne({resetPasswordToken,
                  ressetPasswordExpire:{$gt:Date.now()} 
                });
                resetPasswordToken
                if(!user)
                {
                   console.log(user);
                     return next(new ErrorHandler("Reset password has been expired",400));
                }
                  if(req.body.password!==req.body.confirmpassword)
                  {
                    return next(new ErrorHandler("Password Are not Matched",400));
                  }
                  user.password= req.body.password;
                   user.resetPasswordToken= undefined;
                   user.ressetPasswordExpire=undefined;
                    await user.save();
                     sendtoken(user,200,res);
 }))
//  get user details
   

 router.get('/getUserDetails',Authentication,CatchAsyncError(async(req,res,next)=>{
    const user= await userSche.findById(req.user.id);
        res.status(201).json({
           sucess:true,
           user
        })

 }))
//  only update password only user
  
  router.put("/UpdatePassword",Authentication, bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
       console.log(req.body);
   
        
      const user= await userSche.findById(req.user.id).select("+password");
        
      const PasswordMAtch = await user.comparPassword(req.body.oldPassword);
       if(!PasswordMAtch)
       {
            return next(new ErrorHandler("Invalid Password",401));        
       }
       if(req.body.newPassword!==req.body.confirmPassword)
       {
        return next(new ErroHandler("Password are incorrect",403))
       }
      
      user.password=req.body.newPassword;
      await user.save();

        
        res.status(200).json({
           sucees:true,
          user
         })
          
  }));
  // only update user email and name
   router.put('/Updateuser',Authentication,bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
     console.log(req.body);
     const user=await userSche.findById(req.user.id);
      user.name= req.body.name||user.name;
       user.email=req.body.email||user.email;
       await user.save({validateBeforeSave:false});
    
     res.status(200).json({
      sucees:true,
     user
    })
      }))
      // only Access the admin this route
       router.get('/getalluser',Authentication,authorizerole("admin"),CatchAsyncError(async(req,res,next)=>{
          
           const user= await userSche.find();
           if(!user)
           {
             return next(new ErroHandler("Not users Found ",404)) 
           }
            
           res.status(200).json({
            sucees:true,
           user
          })

         
       }))
      //  only admin Access user id 
        router.get('/GetUser/:id',Authentication,authorizerole("admin"),CatchAsyncError(async(req,res,next)=>{
           const user= await userSche.findById(req.params.id);
           if(!user)
           {
             return next(new ErrorHandler(` user not found this is id ${req.params.id}`,404));
           }
           res.status(200).json({
            sucees:true,
           user
          })
        
        }))
        // Admin upadte role user or admin

      router.put('/role/:id',authentication,authorizerole("admin"),bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
          const user= await userSche.findById(req.params.id);
          if(!user)
          {
            return next(new ErrorHandler(` user not found this is id ${req.params.id}`,404));
          }
          user.role =req.body.role;
           await user.save();
           res.status(200).json({
            sucees:true,
           user
          })
            
           
      }))
        // Delete Admin Any user
         router.delete('/delelUser/:id',Authentication,authorizerole("admin"),CatchAsyncError(async(req,res,next)=>{
          console.log(req.params.id);
           const user= await userSche.findById(req.params.id);
           if(!user)
           {
             return next(new ErrorHandler(` user not found this is id ${req.params.id}`,404));
           }
            await user.deleteOne();
            res.status(200).json({
              sucees:true,
             message:"User Deletion Suceedfull" 
            })
             }))
 module.exports= router;