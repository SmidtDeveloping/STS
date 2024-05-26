const mongoose = require("mongoose")
const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    discordid: String,
    secret: String,
    tweefa: Boolean
})
const Loginschema = mongoose.model('Login', loginSchema);

module.exports = Loginschema