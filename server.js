const express = require('express');
const bodyParser = require('body-parser');
const IdentifyRouter=require('./routes/IdentifyRouter');
const app=express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/identify',IdentifyRouter);
app.get('/',(req,res)=>{
    res.send('Welcome to Bitespeed!');
})
app.listen(8000,()=>console.log("LISTENING ON PORT 4000"));