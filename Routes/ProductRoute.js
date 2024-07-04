
const bodyParser = require('body-parser');
const express= require('express');
const route= express.Router();
const Schema= require('../Schema/ProductSchema');
const ErrorHandler = require('../ErrorHandler/ErrorHandler');
const ApiFeatures= require('../ApiFeatures/ApiFeature')
const CatchAsyncError= require('../Middleware/CatchAsyncError');
const authentication= require('../Middleware/isAuthenticated');
const authorizerole= require('../Middleware/RoleAuthorizes');
const router = require('./UserRoute');
   
  route.get('/',(req,res)=>{
     res.json('Hello Default Route');
  })
   route.post('/Add',authentication,authorizerole("admin"),bodyParser.json(),async(req,res,next)=>{
          req.body.user=req.user.id;
        const product= await Schema.create(req.body);
        if(!product){
         return next(new ErrorHandler("product not found",404));
         }
          res.status(200).json({
             sucees:true,
             product
          })
      })
       route.get('/getdata',CatchAsyncError(async(req,res,next)=>{
         
         const resultperpage=8;

            
          const productCount= await Schema.countDocuments();
            const apifeature= new ApiFeatures(Schema.find(),req.query).search().filter().pagintation(resultperpage);

              let products= await apifeature.query;
               // console.log(products);
               let filterdCount = products.length;
               // apifeature.pagintation(resultperpage);
               // products= await apifeature.query;
            

         //   const product= await Schema.find();
            if(!products)
            {
               return next(new ErrorHandler("product not found",404));
            }
             res.status(200).json({
                sucees:true,
                 products,
                 resultperpage,
                 productCount,
                 filterdCount

             })
       }))
       route.get('/get/:id',bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
         const product= await Schema.findById(req.params.id);
          if(!product)
          {
               return next(new ErrorHandler("product not found",404));
          }
           res.status(200).json({
              sucees:true,
               product
           })
     }))
     route.delete('/delete/:id',authentication,authorizerole("admin"),bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
      const product = await Schema.findById(req.params.id)||null;
       if(product==null)
       {
         return next(new ErrorHandler("product not found",404));
       }
       else
       {
          await product.deleteOne();
           
              res.status(200).json({
                 sucees:true,
                  message:"delete Suceefully"
              })
            }
            }))
             route.put('/update/:id',authentication,authorizerole("admin"),bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
                  let product=await Schema.findById(req.params.id)||null;
                  if(product==null)
                  {
                      return next(new ErrorHandler("product not found",404));
                  }
                  else
                  {
                       product = await Schema.findByIdAndUpdate(req.params.id,req.body);
                        
                     }
                     res.status(200).json({
                      sucees:true,
                       product
                     })
             }))
               
              route.post('/review',authentication, bodyParser.json(),CatchAsyncError(async(req,res,next)=>{
             const {rating,comment,productid}= req.body;
              const review={
                 user:req.user._id,
                 name:req.user.name,
               rating,
               comment,
               productid
              }
               
                const product= await Schema.findById(productid);
                  const isReviewed= product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString())
                 if(isReviewed)
                 {
                    product.reviews.forEach((rev)=>{
                     if(rev.user.toString()===req.user._id.toString())
                     {
                       (rev.name=req.user.name),(rev.rating=rating),(rev.comment=comment);
                     }
                    })
                   
                 }
                 else
                 {
                    product.reviews.push(review);
                    product.numOfReviews=product.reviews.length;
                 }
                 let avg=0;
                  product.reviews.forEach(key=>{
                     avg=+key.rating;
                  })
                   product.rating= avg/product.reviews.length;
                 
                 await product.save({validateBeforeSave:false});
                 
                res.status(200).json({
                   sucees:true,
                   product
                })

            
                  
              }))
               router.get('/GetReview',CatchAsyncError(async(req,res,next)=>{
                    const product= await Schema.findById(req.query.id);
                     if(!product)
                     {
                         return next( new ErrorHandler("Product not foud",404));
                        
                     }
                      res.status(200).json({
                         success:true,
                         reviews:product.reviews
                            
                      })
               }))
                router.delete('/deleteRevies',authentication,CatchAsyncError(async(req,res,next)=>
                {
                  let product= await Schema.findById(req.query.productid);
                     if(!product)
                     {
                         return next( new ErrorHandler("Product not foud",404));
                        
                     }
                     const reviews= product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString());
                     //  const delteReview= product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString())
                     //  console.log(reviews);

                     let avg=0;
                      reviews.forEach((key)=>{
                         avg=+key.rating;
                      })
                      console.log("Average",avg)
                      const rating= avg/product.reviews.length;
                       const numOfReviews= product.reviews.length;
                       
                       console.log(reviews,rating,numOfReviews);
                      await product.updateOne({reviews,rating,numOfReviews});

                     //     const after= await Schema.findByIdAndUpdate(req.query.productid,{
                     //           reviews,rating,numOfReviews
                     //       } 
                     //     );
                     //     console.log(after);
                     
                          
                     res.status(200).json({
                        success:true,
                        Message:"Reviews Sucessfully deletd"
                           
                     })
                }))
   module.exports= route;