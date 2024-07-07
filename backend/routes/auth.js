const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=require('../models/User')
const bcrypt = require('bcryptjs')
const {Schema}=mongoose;
const {body,validationResult}= require('express-validator')
const JWT_SECRET=process.env.JWT_SECRET
const jwt=require('jsonwebtoken')
const fetchUser=require('../middleware/fetchUser')

//ROUTE 1: create a user using: POST "/api/auth/createuser" . Doesn't require login
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 8 characters').isLength({min:8})
],async (req,res)=>{
    let success=false;
    //if there are no errors return that request
    const result=validationResult(req)
    if(!result.isEmpty()){
        return res.send({success,errors:result.array()})
    }
    
    try{
        
        //check whether the user with this email exists already
        let user=await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).json({success,error:"An user with this email already exists"})
        }
        const salt =await bcrypt.genSalt(10)
        const secPass =await bcrypt.hash(req.body.password, salt)
        //creating a user
        user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass
        })

        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET)

        success=true
        // res.json(user)
        res.json({success,authToken})
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 2: Authenticate a user using POST: /api/auth/login , no login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password cannot be empty').exists()],
async (req,res)=>{
    let success=false
    const result=validationResult(req)
    if(!result.isEmpty()){
        return res.send({error:result.array()})
    }
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({success,error:"please login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({success,error:"please login with correct credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET)
        success=true
        res.json({success,authToken})

    }catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 3: get logged in user details using POST: /api/auth/getuser , login required
router.post('/getuser',fetchUser,
async (req,res)=>{
    try {
        const userId=req.user.id
        const user=await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message) 
        res.status(500).send("internal server error")       
    }
})
module.exports=router