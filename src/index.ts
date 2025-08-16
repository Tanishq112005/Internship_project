import { validator } from "./middlewares/checking_url_function";

import { scrapping } from "./middlewares/scrapping_website";
import { inserting_in_database } from "./database/database_insert";
import { createClient } from "@supabase/supabase-js";
import { public_key, url } from "./keys";
const express = require('express') ; 
const app = express() ; 

app.use(express.json()) ; 
const port = 3000 ; 


export const client =  createClient(url , public_key) ; 
console.log("Database is connected") ; 
app.post("/" , function(req : any , res : any){
    res.status(200).json({
        "msg" : "hello"
    })
}) ; 

// main function of this route is to validate the website is there or not , scrapped the website and then insert in the
// database 
app.post("/analyizer" , validator , scrapping , inserting_in_database) ; 
   
app.listen(port , function() {
    console.log(`Server is starting on the port ${port}`) ; 
})
