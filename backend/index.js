const connectToMongo=require('./db.js')
const express=require('express')
var cors = require('cors')
var app = express()
 
app.use(cors())
app.use(express.json())

const port=process.env.PORT
connectToMongo()

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`Listening on port =>  http://localhost:${port}`)
})


