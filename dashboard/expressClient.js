
//Imports

const client = require("../src/botClient")
require("dotenv").config()
const express = require("express");
const session = require('express-session');
const mongoDBStore = require("connect-mongodb-session")(session)
const bodyParser = require('body-parser');
const path = require("path")
const app = express()

// Router imports 


const router_index = require("./routers/index")
const router_auth = require("./routers/login_uit")


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


app.use(router_auth)
app.use(router_index)

//Export

module.exports = app