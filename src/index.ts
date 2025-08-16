import { connection_to_database } from "./database_connection";

const express = require('express') ; 
const app = express() ; 

app.use(express.json()) ; 
const port = 3000 ; 
connection_to_database ; 
console.log("Database is connected") ; 


app.post("/" , function(req : any , res : any){
    res.status(200).json({
        "msg" : "hello"
    })
}) ; 
app.listen(port , function() {
    console.log(`Server is starting on the port ${port}`) ; 
})