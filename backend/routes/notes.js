const express=require('express')
const router=express.Router()
const fetchUser=require('../middleware/fetchUser')
const Notes=require('../models/Notes')
const {body,validationResult,check}= require('express-validator')




//ROUTE 1: get all notes using: GET "/api/notes/fetchallnotes" .require login
router.get('/fetchallnotes',fetchUser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.user.id})    
        res.json(notes)
    } catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 2: add notes using: POST "/api/notes/addnote" .require login
router.post('/addnote',fetchUser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters long').isLength({min:3})
],async (req,res)=>{

    try {
        
        const {title,description,tag}=req.body
    
        //check for errors in input
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const note = new Notes({
            user:req.user.id,title,description,tag
        })
        const savedNote = await note.save()
        
        console.log(req.body)
        console.log(savedNote)
        res.json(savedNote)
        
    } catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

//ROUTE 3: update notes using: PUT "/api/notes/updatenote" . require login
router.put('/updatenote/:id',fetchUser,async(req,res)=>{
    const {title,description,tag}=req.body
    try{

        //create a new note
        const newNote={}
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}
    
        //find the note to be updated and update it
        const note=await Notes.findById(req.params.id)//'params' refer to the id given in the route /updatenote/:id
        if(!note){return res.status(404).send("Note note found")}
    
        //allow updation only if the user owns the note
        if(note.user.toString()!==req.user.id){return res.status(401).send("Invalid operation")}
        const notes=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({notes})
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

//ROUTE 4: delete notes using: DELETE "/api/notes/updatenote" . require login
router.delete('/deletenote/:id',fetchUser,async(req,res)=>{
    try{

        //find the note to be deleted
        let note=await Notes.findById(req.params.id)//'params' refer to the id given in the route /updatenote/:id
    
        //allow deletion only if user owns this note
        if(!note){return res.status(404).send("Note note found")}
        if(note.user.toString()!==req.user.id){return res.status(401).send("Invalid operation")}
         note=await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been Deleted",note:note})
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
module.exports=router