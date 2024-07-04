const express= require('express');
 const routing= express.Router();
 const CatchAsyncError= require('../Middleware/CatchAsyncError');
 const authentication= require('../Middleware/isAuthenticated');
 const stripe = require('stripe')(process.env.SECRET_KEYSTRIPE)
  const Order= require('../Schema/OrderSchema');
const ErrorHandler = require('../ErrorHandler/ErrorHandler');
const authrizerole= require('../Middleware/RoleAuthorizes');
const bodyparser= require('body-parser');
const Product = require('../Schema/ProductSchema');
const authorizerole = require('../Middleware/RoleAuthorizes');
  routing.get('/order',(req,res)=>{
     res.json("this is order Route");

  })
   routing.post('/NewOrder',authentication,bodyparser.json(),CatchAsyncError(async(req,res)=>{
       console.log(req.body);
       
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,ShippingPrice,totalPrice}= req.body;
     
   const order= await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice
      ,taxPrice,ShippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id});
  
         
      res.status(200).json({
           suceess:true,
          order
      })

   }))
    routing.get('/getSingle/:id',authentication,authrizerole('admin'),CatchAsyncError(async(req,res)=>{
   const order = await Order.findById(req.params.id).populate("user","name email");
     if(!order) 
     {
        return next(new ErrorHandler("Order not found",404));

     }  
      res.status(200).json({
          suceess:true,
          order
      })
    }
    ))
     routing.get('/Myorder',authentication,CatchAsyncError(async(req,res)=>{
      const order= await Order.find({user:req.user._id});
       
       if(!order)
       {
           return next(new ErrorHandler("Order not found",404));
       }
        res.status(200).json({
          suceess:true,
           order
        })
      }))
       routing.get('/allorder',authentication,authrizerole("admin"),CatchAsyncError(async(req,res,next)=>{
       
         const order= await Order.find();
          if(!order)
          {
             return next(new ErrorHandler("order not found",404));
          }
           res.status(200).json({
             suceess:true,
              order
           })
           
       }))

        routing.put('/upate/:id',authentication,authrizerole("admin"),CatchAsyncError(async(req,res,next)=>{
         //  console.log(req.body);
          const order = await Order.findById(req.params.id);
         //  console.log(order.paymentInfo.status);
            
          if(order.paymentInfo.status==="Deliverd")
          {
             return next(new ErrorHandler("Your order already deliverd",401))
          }
           order.orderItems.forEach(async(key)=>{
             await updateStock(key.product,key.quantity);
           })
           order.paymentInfo.status = req.body.status;
            if(req.body.status==="Deliverd")
            {
               order.DeliverdAt= Date.now();
            }
             await order.save({validateBeforeSave:false});    
             res.status(200).json({
               suceess:true,
                order
             });
                 }));
     async function updateStock(id,quantity)
         {
              const product= await Product.findById(id)
               product.Stock-=quantity;
              await product.save({validateBeforeSave:false});
           
         }
          routing.delete('/delete/Order',authentication,authorizerole,CatchAsyncError(async(req,res)=>{
             const order = await Order.findById(req.params.orderid);
              if(!order)
              {
                return next(new ErrorHandler("order are not found",404 ));
              }
              await order.deleteOne();
               res.status(200).json(

                  {
                      suceess:true
                  }
               )
          }))
  
  module.exports=routing;
 