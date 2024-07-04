const mongoose= require('mongoose');
 mongoose.connect(process.env.MONGO_DB).then(()=>{
     console.log("MongoDb Connectd");
 })
 .catch(()=>{
     console.log("Not Connected ");
 })