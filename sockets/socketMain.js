const io = require("../server").io
const Orb = require("./classes/Orbs")
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const Player = require('./classes/Player')
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

//Global variables
let orbs = []
let players = []
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500,
}

//create orbs
initGame()

//handle connection
io.sockets.on('connection',(socket)=>{
    //A player has connected
    let player = {};
    let playerData

    socket.on('init',(data)=>{
        //Add the player to the game namespace
        socket.join("game")
        //make a player config object (things the server needs to track, but players dont need to know)
        let playerConfig = new PlayerConfig(settings)
        //make a playerData object (everyone needs to know)
        playerData = new PlayerData(data.playerName,settings)
        players.push(playerData)

        // make a master player object to hold both
        player = new Player(socket.id, playerConfig, playerData)

        //issue a message to every connected socket at a rate of 30 FPS
        setInterval(()=>{
            io.to('game').emit("tock",{
                players,
                playerX:player.playerData.locX,
                playerY:player.playerData.locY
            })

        },33)

        //send Data to client
        socket.emit('initReturn',{
            orbs
        })

    })

    //receives ticks from client that contains movement vector.s
    socket.on("tick",(data)=>{


        let speed = player.playerConfig.speed

        //updates the player config object with the new direction
        if(data.xVector === undefined || data.yVector === undefined){
            data.xVector = 0
            data.yVector = 0
        }
        let xV = player.playerConfig.xVector = data.xVector;
        let yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.locX < 5 && xV < 0) || (player.playerData.locX > 500) && (xV > 0)){
            player.playerData.locY -= speed * yV;

        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > 500) && (yV < 0)){
            player.playerData.locX += speed * xV;

        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig,orbs,settings)
        capturedOrb.then((data)=>{
            //runs if collision occurs
            console.log("orb collision")

        }).catch((error)=>{
            console.log("No collision")
        })


    })

})



//HELPER FUNCTIONS.

//Run at the beginning of a new game
//to create new orbs
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings))
    }
}



module.exports = io;
