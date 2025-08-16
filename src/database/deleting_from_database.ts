// this is also the middleware in which we have to delete the value from the database 

import { client } from "..";

export async  function deleting_from_database(req : any , res : any){
    const {id} = req.params ; 
    const { data, error } = await client.from('websites').delete().match({ id });

    if(error){
        res.status(500).json({
            msg : "Something went wrong in deletion of the data"
        }) 
    }
    else {
        res.status(200).json({
            msg : "Data is deleted from the database"
        })
    }
}