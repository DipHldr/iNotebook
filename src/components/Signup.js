import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const [credentials,setCredentials]=useState({name:"",email:"",password:""})
    const navigate=useNavigate()
    const {showAlert}=props
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const {name,email,password}=credentials
        const response=await fetch('http://localhost:5000/api/auth/createuser',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name,email,password})
        })
        const json=await response.json()
        console.log(json)
        if(json.success){
            localStorage.setItem('token',json.authToken)
            navigate('/')
            showAlert('Account Created Successfully','success')

        }else{
            showAlert('try different credentials','danger')
        }


    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})

    }
  return (
    <div className="container mt-2">
        <h2>Create an Account to Use to iNotebook</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
    <label htmlFor="name" className="form-label">Username</label>
    <input type="text" value={credentials.name} className="form-control" onChange={onChange} name="name" id="name" aria-describedby="emailHelp" minLength={3} required/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" value={credentials.email} className="form-control" onChange={onChange} name="email" id="email" aria-describedby="emailHelp" required/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" value={credentials.password} className="form-control" onChange={onChange} name="password" id="password" minLength={8} required/>
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  )
}

export default Signup
