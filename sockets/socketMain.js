const io = require("../server").io
const Orb = require("./classes/Orbs")

//Global variables
let orbs = []
initGame()

io.sockets.on('connection',(socket)=>{
    socket.emit('init',{
        orbs
    })
})



//HELPER FUNCTIONS

//Run at the beginning of a new game
//to create new orbs
function initGame(){
    for(let i = 0; i < 500; i++){
        orbs.push(new Orb())
    }
}



module.exports = io;
