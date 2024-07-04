//  const Schema= require('../Schema/ProductSchema');
class ApiFeatures{
     constructor(query,querystr){
        this.query=query;
         this.querystr=querystr;
          // console.log(this.querystr);
          // console.log(this.query);

     }
      search()
      {
        const keyword=this.querystr.keyword?{
             name:{
                 $regex:this.querystr.keyword,
                 $options:'i'
             }
        }:{};
        this.query= this.query.find({...keyword});
         return this;
      }
        filter()
       {
         const queryCopy={...this.querystr};
         console.log("Initial query Copy",queryCopy);
          //  console.log(gte);
            const remove=["keyword","page","limit"];
            // console.log(queryCopy);
             remove.forEach(key=>delete queryCopy[key])
             console.log(queryCopy);
              
            let strin= JSON.stringify(queryCopy);
               // let query= {price:{"$gte":2000,""}}
            
              strin= strin.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
               console.log(strin);
                
               
                    this.query=this.query.find(JSON.parse(strin));
                     
                    
               
             
                return this;
         }
          pagintation(page){
             const data= this.querystr.page||1;
              const skip=page*(data-1);
               this.query=this.query.limit(page).skip(skip);
               return this;
          }

}
 module.exports= ApiFeatures;