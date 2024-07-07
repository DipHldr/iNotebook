import React from 'react'

function Alert(props) {
    const capitalize = (word)=>{
        if(word==='danger'){
            word='Error'
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{height: '50px'}}>
        {props.alert && <div className={`alert alert-${props.alert.type?props.alert.type:'success'} alert-dismissible fade show`} role="alert">
           <strong>{capitalize(props.alert.type?props.alert.type:'Hello')}</strong>: {props.alert.msg?props.alert.msg:'Welcome'} 
        </div>}
        </div>
    )
}

export default Alert