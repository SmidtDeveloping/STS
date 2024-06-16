
//Imports

require("dotenv").config()
const express = require("express");
const session = require('express-session');
const mongoDBStore = require("connect-mongodb-session")(session)
const bodyParser = require('body-parser');
const path = require("path")
const app = express()

// Router imports 


const router_index = require("./routers/index")
const router_punten = require("./routers/Puntenbeheer")
const router_woorden = require("./routers/reward")
const router_leaderboard = require("./routers/leaderboard")
const router_discordAuth =require("./routers/discordAuth")
// Sessie opslag

const store = new mongoDBStore({
	uri: process.env.DATABASE,
	collection: "sessies"
})

// Auth Sessie
app.use(session({
	secret: "MT",
	resave: false,
	saveUninitialized: true,
	store: store
}))

// Bodyparses

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// EJS 

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

//Static

app.use('/static', express.static(path.join(__dirname, 'public')))

// Routers


app.use(router_index)
app.use(router_punten)
app.use(router_woorden)
app.use(router_leaderboard)
app.use(router_discordAuth)


//Export

module.exports = app