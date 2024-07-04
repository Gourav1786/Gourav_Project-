const mongoose= require('mongoose');
// const { stringify } = require('querystring');
 const ProductSchema= new mongoose.Schema({
    name:{
         type:String,
         required:[true,"please Enter the Name"]
    },
    Description:{
         type:String,
         required:[true,"please Enter the Description"]
    },
    price:{ 
         type:String,
          required:[true,"please Enter the Price"],
          maxlength:[8,"Price Cannot exceed 8 chractes"]
    },
    rating:{
        type:Number,
        default:0
    },
     images:[
        {
            public_id:{
                 type:String,
                  required:true,
            },
             url:{  
                      type:String,
                      required:true
             }
        }
     ],
     category:{
         type:String,
        required:[true,"Please Enter Category"]
     },
     Stock:{
         type:String,
          required:[true,"Please Enter the stock"],
          maxlength:[4,"Stock Cannot be exceed 4"],
          default:0

     },
     numOfReviews:{
         type:String,
          default:0
     },
     reviews:[
        {
          user:{
               type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true

            },
             name:{
                 type:String,
                 required:true  
             },
              rating:{
                type:Number,
                required:true
              },
                comment:{
                     type:String,
                      required:true
                }

            }
        
            ],
             user:{
                type:mongoose.Schema.ObjectId,
                 ref:"user",
                 required:true

             },
            createdAt:{
                 type:Date,
                  default:Date.now
            }

 })
//  module.exports= mongoose.model(ProductSchema);
 const Product= mongoose.model('Product',ProductSchema);
  module.exports= Product;
