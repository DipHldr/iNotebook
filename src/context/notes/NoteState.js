import React,{useState} from 'react';
import NoteContext from './NoteContext.js';

const NoteState= (props)=>{
  const host='http://localhost:5000'
  const [notes,setNotes]=useState([])
//fetch all notes
const getAllNotes=async ()=>{
  
  //API call
  const response=await fetch(`${host}/api/notes/fetchallnotes`,{
    method:'GET',
    headers:{
        'Content-Type':'appplication/json',
        'auth-token':localStorage.getItem('token')
    },
  });
  const json=await response.json()
  console.log(json)
  setNotes(json)
}

  //ADD a note
  const addNote = async (title, description, tag) => {
    // TODO: API Call
    // API Call 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });

    const note = await response.json();
    setNotes(notes.concat(note))
    
  }

  
  //DELETE a node
  const deleteNote=async (id)=>{
    //TODO: API call
    const response=await fetch(`${host}/api/notes/deletenote/${id}`,{
      method:'DELETE',
      headers:{
          'Content-Type':'appplication/json',
          'auth-token':localStorage.getItem('token')
      }
    });
    const json=response.json() 
    console.log(json)
    console.log(`deleting the note with id ${id}`)
    const newNotes=notes.filter((notes)=>{return notes._id!==id})
    setNotes(newNotes)
        
  }

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const json = await response.json(); 
    console.log(json)

     let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag; 
        break; 
      }
    }  
    setNotes(newNotes);
  }


    return(
        <NoteContext.Provider value={{notes,setNotes,addNote,deleteNote,editNote,getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState 
