
import { client } from "..";

// this is the middleware but doing the database operation to insert the data 
export async function inserting_in_database(req : any , res : any ) {
     
     const {url , brandName , description} = req.body ;
     console.log("ok") ;
     console.log(url) ;
     console.log(brandName) ;
     console.log(description) ;  
     const { data, error } = await client.from('websites')
     .insert([
       { 
         url: url, 
         brand_name: brandName,
         description: description
       }
     ])
     .select() 
     .single();


   if (error) {
     // if this url is already checked 
     if (error.code === '23505') {
       return res.status(409).json({ msg: 'This URL has already been analyzed.' });
     }
   
    else {
        console.log(error) ; 
        return res.status(500).json({
            msg : "Some another error" 
        })
    }
   }


   res.status(201).json({
    msg : "New Item is created in the database" 
   })

 }
