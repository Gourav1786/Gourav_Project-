const mongoose= require('mongoose');
const order= new mongoose.Schema({
     shippingInfo:{
          address:{
             type:String,
             required:true
          },
          city:{
            type:String,
             required:true
          },
          state:{
            type:String,
             required:true
          },
          country:{
            type:String,
             required:true
          },
          pincode:{type:Number,
            required:true},
          phone:{
            type:Number,
             required:true
          },
           
     },
     orderItems:[
      {
            name:{
            type:String,
             required:true
             },
            price:{
            type:Number,
             required:true
            },
             quantity:{
               type:Number,
               required:true
            },
             image:{
                 type:String,
                  required:true
                  },
            product:{
              type:mongoose.Schema.ObjectId,
              ref:"product",
               required:true
           } 
         }
         ], 
         user:{
          type:mongoose.Schema.ObjectId,
          ref:"user",
         required:true
     },
    paymentInfo:{
        id:{
              type:String,
               required:true

        },
        status:{
            type:String,
             required:true
            }
    },
     paidAt:{
         type:Date,
          required:true
     },
      itemsPrice:{
         type:Number,
          required:true,
         default:0
         },
         taxPrice:{
            type:Number,
             required:true,
            default:0
            },
            ShippingPrice:{
                type:Number,
                 required:true,
                default:0
                },
                totalPrice:{
                    type:Number,
                     required:true,
                    default:0
                    },
                     DeliverdAt:
                     {  type:Date,
                          default:Date.now}

})
module.exports= mongoose.model('order',order);