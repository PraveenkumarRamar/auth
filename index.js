const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT
app.use(express.json())
app.use(cors())

const indexRouter = require('./router/index')
const userRouter = require('./router/user')

app.use('/',indexRouter)
app.use('/users',userRouter)

app.listen(port,()=>console.log(`app is running ${port}`))
// app.listen(8000,()=>console.log(`app is running 8000`))