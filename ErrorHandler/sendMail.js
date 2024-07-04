const nodemailer= require('nodemailer');
  
const sendmail= async(options)=>{
    
    const transporter= nodemailer.createTransport({
         
         service:process.env.SERVICE,
          host:"smtp.gmail.com",
          port:465,
          secure:true,
            logger:true,
            debug:true,
         auth:{
              user:process.env.SMPT_USER,
              pass:process.env.SMPT_PASSWORD
         },
     //     tls:{
     //       rejectUnauthorized:true
     //     }
    })
     const mailoptions={
         from:process.env.SMPT_USER,
         to:options.email,
         subject:options.subject,
         text:options.message
         
     }

     await transporter.sendMail(mailoptions);
}
module.exports= sendmail;    