function checker(url : string) : boolean {
    try {
        new URL(url) ; 
        return true ; 
    }
    catch(err){
        return false; 
    }
}

export  function validator(req : any , res : any , next : any){
    const {url} = req.body ; 
    if(checker(url)){
        console.log("ok") ; 
        next() ; 
    }
    else{
        res.status(404).json({
            msg : "URL Is Incorrect"
        })
    }
}