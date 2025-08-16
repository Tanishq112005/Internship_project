import { client } from "..";

// this is the route for updating the value in the database 
interface update  {
   brand_name? : string ;
   description? : string ; 
   url? : string  ;
}
export async function updating_the_value(req : any , res : any){
    const {id} = req.params ; 
    const { brand_name, description, url } = req.body; 


    const updates : update = {};
    if (brand_name !== undefined) {
      updates.brand_name = brand_name;
    }
    if (description !== undefined) {
      updates.description = description;
    }
    if (url !== undefined) {
      updates.url = url;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'At least one field (url, brand_name, description) must be provided to update.' });
    }
  
    try {
     
      const { data, error } = await client
        .from('websites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
  
      if (error) {
     
        if (error.code === '23505') {
          return res.status(409).json({ msg: 'The provided URL already exists.' });
        }
        throw error;
      }
  
      if (!data) {
        return res.status(404).json({ msg: 'Record not found.' });
      }
  
      res.status(200).json({
        msg : "Your Data is updated" , 
        data : data 
      });
  
    } catch (error) {
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
}