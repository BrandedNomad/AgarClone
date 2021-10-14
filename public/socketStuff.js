
//connect to server
let socket = io.connect("http://localhost:3000")

//only executed once player clicks on start game
function init(){
    draw()
    socket.emit("init",{
        playerName:player.name
    })
}

//The initial data returned from server once the game has started
socket.on("initReturn",(data)=>{
    orbs = data.orbs

    setInterval(()=>{
        socket.emit("tick",{
            xVector:player.xVector,
            yVector:player.yVector
        })
    },33)
})

socket.on("tock",(data)=>{
    //update list of players
    players = data.players
    player.locX = data.playerX
    player.locY = data.playerY


})

