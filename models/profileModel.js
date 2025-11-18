const moongoose = require('mongoose');
const express = require('express')

const Schema = new moongoose.Schema({
    username : String ,
    email : String ,
    country : String,
    fullName : String,
    gender : String ,
    username : String ,
    phone: Number ,
    dob : Date ,
    about : String
    
    
})

module.exports = moongoose.model("ProfileModel" , Schema);