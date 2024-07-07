import React,{useContext} from 'react'
import NoteContext from '../context/notes/NoteContext.js'
const NoteItem=(props)=>{
    const {note,updateNote}=props
    const context=useContext(NoteContext)
    const {deleteNote}=context 
    const {showAlert}=props
    
    return(
            <>
            
            <div className="card col-md-3 mx-3 my-2">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <h5 className="card-title">{note.title}</h5>
                    <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                    <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);showAlert('Note Deleted','danger')}}></i>
                </div>
                <p className="card-text">{note.description}</p>                 
            </div>
            </div>
                    
            </>
    )
}

export default NoteItem