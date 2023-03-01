'use strict';
// test From Ala' 
//import the express framework

const express = require('express');

const server = express();

const axios = require('axios');
require('dotenv').config();

//import cors
const cors = require('cors');
// import data.json 
const data = require('./Movie Data/data.json');

//server open for all clients requests
server.use(cors());
server.use(express.json());
const pg = require('pg'); // importing the pg 
const PORT = 3000;

const client = new pg.Client(process.env.DATABASE_URL);
//constructor

function Data(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}
//constructor
function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
//constructor
function Network(id, file_type, file_path, aspect_ratio) {
    this.id = id;
    this.file_type = file_type;
    this.file_path = file_path;
    this.aspect_ratio = aspect_ratio;
}
// http://localhost:3000/
server.get('/', homeHandler)
// http://localhost:3000/favorite
server.get('/favorite', favoriteHandler)
//http://localhost:3000/trending
server.get('/trending', trendingHandler)
//http://localhost:3000/search
server.get('/search', searchHandler)
//http://localhost:3000/genres
server.get('/genres', genresHandler)
//http://localhost:3000/network
server.get('/network', networkHandler)
//http://localhost:3000/getMovies
server.get('/getMovies', getMoviesHandler)
//http://localhost:3000/addMovieInfo
server.post('/addMovieInfo', addMovieInfoHandler)
//wronge route
server.get('*', defaltHandler)
server.use(errorHandler)

// Functions Handlers

function homeHandler(req, res) {
    let newobj = new Data(data.title, data.poster_path, data.overview);
    res.send(newobj);
}
function favoriteHandler(req, res) {
    let str = "Welcome to Favorite Page";
    res.send(str);
}
function defaltHandler(req, res) {
    res.status(404).send('404 page not found error');
}
function trendingHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&language=en-US`;
        axios.get(url)
            .then(axiosRes => {
                let mapRe = axiosRes.data.results.map((item) => {
                    let trendMovie = new Movies(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return trendMovie;
                })
                res.send(mapRe);
            })
            .catch((error) => {
                console.log("sorry something went wrong", error);
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function searchHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=The Lair&page=2`;
        axios.get(url)
            .then((axiosRes) => {
                let mapRe = axiosRes.data.results.map((item) => {
                    let searchMovie = new Movies(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return searchMovie;
                })
                res.send(mapRe);
            })
            .catch((error) => {
                console.log("sorry something went wrong", error);
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}
function genresHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`;
        axios.get(url)
            .then((axiosRes) => {
                let mapRe = axiosRes.data.genres.map((item) => {
                    let genresMovie = new Movies(item.id, item.name);
                    return genresMovie;
                })
                res.send(mapRe);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

}
function networkHandler(req, res) {
    try {
        const api_key = process.env.api_key;
        const url = `https://api.themoviedb.org/3/network/2/images?api_key=${api_key}`;
        axios.get(url)
            .then((axiosRes) => {
                let mapRe = axiosRes.data.logos.map((item) => {
                    let networkLogos = new Network(item.id, item.file_type, item.file_path, item.aspect_ratio);
                    return networkLogos;
                })
                res.send(mapRe);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

}
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}

function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM moviesInfo`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}
function addMovieInfoHandler(req, res) {
    const newMovie = req.body;
    console.log(newMovie);
    const sql = `INSERT INTO moviesInfo (title, release_date, poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    const values = [newMovie.title, newMovie.release_date, newMovie.poster_path, newMovie.overview];
    //console.log(sql);
    client.query(sql, values)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
}


// http://localhost:3000

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
        })

    })