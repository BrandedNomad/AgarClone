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
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000,
}

//create orbs
initGame()

setInterval(()=>{
    if(players.length >0){
        io.to('game').emit("tock",{
            players
        })
    }
},33)

//handle connection.
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
            socket.emit("tickTock",{
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

        if((player.playerData.locX < 5 && xV < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
            player.playerData.locY -= speed * yV;

        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
            player.playerData.locX += speed * xV;

        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        //ORB Collision
        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig,orbs,settings)
        capturedOrb.then((data)=>{
            //runs if collision occurs
            //emit to all sockets the orb to replace
            const orbData = {
                orbIndex: data,
                newOrb:orbs[data]
            }
            //updating every socket about leaderboard changes
            let leaderBoard = getLeaderBoard()
            io.sockets.emit("updateLeaderBoard",leaderBoard)
            io.sockets.emit('orbSwitch',orbData)

        }).catch((error)=>{
           // console.log("No collision")
        })

        //PLAYER collision
        let playerDeath = checkForPlayerCollisions(player.playerData,player.playerConfig,players,player.socketId)
        playerDeath.then((data)=>{
            //updating every socket about leaderboard changes
            let leaderBoard = getLeaderBoard()
            io.sockets.emit("updateLeaderBoard",leaderBoard)
            //Let everyone know a player died
            io.sockets.emit("playerDeath", data)

        }).catch((error)=>{
            //console.log("no player collision")
        })


    })

    socket.on('disconnect',(data)=>{
        //find out who left...which of the players?
        //first make sure the player exists to avoid errors
        if(player.playerData){
            players.forEach((currentPlayer,i)=>{
                if(currentPlayer.uid === player.playerData.uid){
                    //if the player exists remove the player
                    players.splice(i,1)
                    //update leaderboard
                    io.sockets.emit("updateLeaderBoard",getLeaderBoard())
                }
            });
            //TODO: update the database
            const updateStats = "" //update database
        }



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

function getLeaderBoard(){
    //sort players in desc order
    players.sort((a,b)=>{
        return b.score - a.score;
    })

    let leaderBoard = players.map((currentPlayer)=>{
        return {
            name: currentPlayer.name,
            score: currentPlayer.score
        }
    })

    return leaderBoard
}



module.exports = io;
