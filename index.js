 const dotenv= require('dotenv');
  dotenv.config({path:'./Connection/.env'});
   
require('./Connection/conn');
 const express= require('express');
  const app= express();
  const cors= require('cors');
   const cookieparser= require('cookie-parser');
   app.use(express.json());
   app.use(cookieparser());
   app.use(cors());
  app.use(require('./Routes/ProductRoute'));
  app.use(require('./Routes/UserRoute'));
  app.use(require('./Routes/OrederRoute'));

   app.use(require('./Middleware/Error'));
   






  app.listen(process.env.PORT,()=>{
     console.log(`Server is running on this port No ${process.env.PORT}`);
  })
 