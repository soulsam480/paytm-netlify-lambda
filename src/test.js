const express = require('express')
const serverless = require('serverless-http')

const app = express()
const router = express.Router()
router.get('/',(req,res)=>{
    res.send(
        "yoyo"
    )
})
app.use('/.netlify/functions/test',router)
module.exports.handler = serverless(app)