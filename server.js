/**
 * @overview This file builds the initial server
 */

const express = require("express")
const path = require('path')
const {Server} = require("socket.io")
const helmet =  require("helmet")
const cors = require('cors')

//SERVER SETUP
const port = process.env.PORT || 3000
const app = express()
const publicPath = path.join(__dirname,"./public")
app.use(cors({
    origin:true
}))
app.use(express.static(publicPath))
app.use(helmet())
const expressServer = app.listen(port, ()=>{
    console.log("Server up and running on port " + port)
})
const io = new Server(expressServer, {cors: {origin:'*'}})

module.exports = {
    app,
    io
}
