const JWT_SECRET=process.env.JWT_SECRET
const jwt=require('jsonwebtoken')
const fetchUser=(req,res,next)=>{
    //get the user from the jwt token and add id to request object
    const token=req.header("auth-token")
    if(!token){
        res.status(401).send({error:"Please verify with a token"})
    }
    try {
    const data=jwt.verify(token,JWT_SECRET)
    req.user=data.user
    next()        
    } catch (error) {
        res.status(401).send({error:"Please verify with a token"})
    }
    

}
module.exports=fetchUser