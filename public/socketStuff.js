
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
})

socket.on("orbSwitch",(data)=>{
    //remove orb from orbs array, and replace it with a new orb.
    orbs.splice(data.orbIndex,1,data.newOrb)

})

socket.on("tickTock",(data)=>{
    //update player location
    player.locX = data.playerX
    player.locY = data.playerY
})

socket.on("updateLeaderBoard",(data)=>{
    //first clear leaderboard
    document.querySelector(".leader-board").innerHTML = ""
    //update leaderboard with new score
    data.forEach((currentPlayer)=>{
        document.querySelector(".leader-board").innerHTML += `
        <li class=leader-board-player>${currentPlayer.name} - ${currentPlayer.score}</li>
        `
    })//

})

socket.on("playerDeath",(data)=>{
    document.querySelector("#game-message").innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`
    $("#game-message").css("background-color","#00e6e6")
    $("#game-message").css("opacity","1")

    $("#game-message").show()
    $("#game-message").fadeOut(5000)


})//

