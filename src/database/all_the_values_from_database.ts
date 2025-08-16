// this is also a middleware of the database which provide all the data present in the database 

import { client } from "..";

export async function getting_value(req : any , res : any ) {
    const {data , error} = await client.from('websites').select('*').order('created_at', { ascending: false });
    if(error){
        res.status(500).json({
            msg : "Error Comes in retriving the data" 
        })
    }

    else {
        res.status(200).json({
            msg : "data is collected" ,
            data : data 
        }) ; 
    }
}
