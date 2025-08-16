import { validator } from "./middlewares/checking_url_function";

import { scrapping } from "./middlewares/scrapping_website";
import { inserting_in_database } from "./database/database_insert";
import { createClient } from "@supabase/supabase-js";
import { public_key, url } from "./keys";
import { getting_value } from "./database/all_the_values_from_database";
import { updating_the_value } from "./database/updating_the_value";
import { deleting_from_database } from "./database/deleting_from_database";
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

// this route for getting you the data of all the website 
app.get("/website_data" , getting_value) ; 

// this route for updating the data 
app.put("/update_data/:id" , updating_the_value) ;

// this route for deleting the data 
app.delete("/delete_data/:id" , deleting_from_database) ; 
   
app.listen(port , function() {
    console.log(`Server is starting on the port ${port}`) ; 
})


