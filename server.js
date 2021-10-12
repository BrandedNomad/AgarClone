const express = require("express")
const path = require('path')
const {Server} = require("socket.io")

//SERVER SETUP
const port = process.env.PORT || 3000
const app = express()
const publicPath = path.join(__dirname,"./public")
app.use(express.static(publicPath))
const expressServer = app.listen(port, ()=>{
    console.log("Server up and running on port " + port)
})
const io = new Server(expressServer)
