'use strict';

//import the express framework

const express = require('express');

const server = express();

//import cors
const cors = require('cors');

//server open for all clients requests
server.use(cors());

// import data.json 
const data=require('./Movie Data/data.json');

//constructor

function Data(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;

}


const PORT = 3000;
//home route
// http://localhost:3000/

server.get('/',(req,res)=>{
  let newobj=new Data(data.title,data.poster_path,data.overview) ;
  res.send(newobj);})

// http://localhost:3000/favorite
//Favorite Page Endpoint: “/favorite”
server.get('/favorite',(req,res)=>{
    let str = "Welcome to Favorite Page";
    res.send(str);
})

//wronge route

server.get('*',(req,res)=>{
    res.status(404).send('404 page not found error');
})

server.use((err,req,res)=>{
    res.status(500).send('{"status": 500,"responseText": "Sorry, something went wrong" }');   
})


// http://localhost:3000
server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})

