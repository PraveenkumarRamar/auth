const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.status(200).send(`<h1>Welcome to auth backend</h1><h2>Your app works perfectly</h2>`)
})

module.exports = router;