import axios from "axios";
import * as cheerio from 'cheerio';

export async function scrapping(req : any , res : any , next : any ){
    const {url} = req.body ; 
    try {
      // checking that site is up or not 
      // using the library axios for his 
      const response = await axios.get<string>(url, {
        timeout: 5000,
    });

       // now in the response.data , html of the page is there 
       const html = response.data ; 
       // now we have to extract the brand name and website description from the html page 
       
       const $ = cheerio.load(html);
       const brandName = $('title').text() || $('meta[property="og:site_name"]').attr('content');
       let description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
       if (!description) {
         description = $('p').first().text();
       }

       req.body = {
        url : url , 
        brandName : brandName , 
        description : description
       } ;
    console.log("ok") ; 
       // transferring to the next middleware for inserting the data into the database
       next() ; 
    }
    catch(err){
        res.status(500).json({
            msg : "Failed to analyze the website. It might be inaccessible or timed out."
        }) ; 
    }
}