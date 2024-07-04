const mongoose= require('mongoose');
const validator= require('validator');
const bcrypt= require('bcryptjs');
const jsonwebtoken= require('jsonwebtoken');
const crypto= require('crypto');
const schemas= new mongoose.Schema({
     name:{
         type:String,
          required:[true,"Please Enter the name"],
           maxlength:[30,"Name Should be 30 chracters"],
           minlength:[4,"Name Should be 4 chractes"]
     },
      email:{
         type:String,
          required:[true,"Please Enter the Email"],
          unique:true,
           validate:[validator.isEmail,"please Enter Valid Email"],
  },
   password:{
     type:String,
      required:[true,"Please Enter the password"],
       minlength:[6,"Password must be 6 chracters"],
        select:false
    },
    profile:{
        public_id:{
            type:String,
             required:true
        },
                url:{
                    type:String,
                     required:true

                     
                }
       },
        role:{
            type:String,
             default:"user"
        },
         resetPasswordToken:String,
         ressetPasswordExpire:Date
})
schemas.pre('save',async function(next){
     if(!this.isModified('password'))
     {
        next();
     }
     this.password= await bcrypt.hash(this.password,10);

 })
 schemas.methods.generateAuthToken= async function(){
      
    return jsonwebtoken.sign({id:this._id},process.env.SECRET_KEY);


 }
  schemas.methods.comparPassword=async function(password)
  {
     return await bcrypt.compare(password,this.password);
  }
   schemas.methods.resetPassword= function(){
     const token= crypto.randomBytes(20).toString('hex');
       this.resetPasswordToken= crypto.Hash('sha256').update(token).digest('hex');
        this.ressetPasswordExpire = Date.now()+15 * 60 *1000;
        return token;
    
   }

 const user= mongoose.model('user',schemas);
  module.exports= user;