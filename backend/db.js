const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config();


const mongoURI=process.env.MONGO_URL

const connectToMongo=()=>{
    mongoose.connect(mongoURI)
    .then(()=>{
        console.log('connected to mongo successfully')
    })
    .catch((err)=>{console.log('error. canot connect to mongo db ' + err.message)})
}

module.exports=connectToMongo;