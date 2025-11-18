const moongoose = require('mongoose');
const express = require('express')

const Schema = new moongoose.Schema({
    username : String ,
    email : String ,
    password : String ,
    
})

module.exports = moongoose.model("userModel" , Schema);