const mongoose = require('mongoose')

const URL = 'mongodb+srv://nirasha:nira9871@cluster0.rkvrj.mongodb.net/aurapos-qaproject'//new database for QA
//mongodb+srv://nirasha:nira9871@cluster0.rkvrj.mongodb.net/aurapos
mongoose.connect(URL)

let connectionObj = mongoose.connection

connectionObj.on('connected' , ()=>{
    console.log('Mongo DB Connection Successfull')
})

connectionObj.on('error' , ()=>{
    console.log('Mongo DB Connection Failed')
})