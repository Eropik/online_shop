// require('dotenv').config()
// const express = require('express')
// const sequelize = require('./db')
// const models=  require('./models/models')
// const cors= require('cors')

// const PORT = process.env.PORT || 5000

// const app = express()
// app.use(cors())
// app.use(express.json())


// //app.get('/',(req,res)=>{res.status(200).json({messege:'TI LOH'})})

// const start = async()=>{
//     try{

//         await sequelize.authenticate()
//         await sequelize.sync()
//         app.listen(PORT, ()=>console.log(`Server started on PORT ${PORT}`))


//     }catch(e)
//     {console.log(e)}
// } 

// start()


require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models=  require('./models/models')
const cors= require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routers/index')
const errorHandler = require('./middleWare/ErrorHandlingMiddleWare')
const path = require('path')

const PORT = process.env.PORT || 5001

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api',router)
app.use(errorHandler)


const start = async()=>{
    try{

        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=>console.log(`Server started on PORT ${PORT}`))


    }catch(e)
    {console.log(e)}
} 

start()


