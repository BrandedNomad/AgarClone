
let socket = io.connect("http://localhost:3000")

socket.on("init",(data)=>{
    orbs = data.orbs
})

