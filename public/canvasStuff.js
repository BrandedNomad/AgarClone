function init(){
    draw()
    console.log(orbs)
}

//Generate random starting co-ordinates
player.locX = Math.floor(500*Math.random() + 10)
player.locY  = Math.floor(500*Math.random() + 10)

//draw player on canvas
function draw(){


    //reset camera to default position
    context.setTransform(1,0,0,1,0,0)
    //first clear any previous drawing
    context.clearRect(0,0,canvas.width,canvas.height)

    //clamp camera to the player
    let camX = -player.locX + canvas.width/2
    let camY = -player.locY + canvas.height/2
    context.translate(camX,camY) //translate is cumulative

    //start over
    context.beginPath()
    //fill color
    context.fillStyle = "rgb(255,0,0)"
    //Draw a circle
    context.arc(player.locX,player.locY,10,0,Math.PI *2)
    //Fill the circle with color
    context.fill()
    //Draw a border around circle
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0,255,0)'
    context.stroke()

    //Add the orbs
    orbs.forEach((orb)=>{
        //first clear any previous drawing
        // context.clearRect(0,0,canvas.width,canvas.height)

        //Create new circle
        context.beginPath()
        //Set fill style
        context.fillStyle = orb.color
        //Draw a circle
        context.arc(orb.locX,orb.locY,orb.radius,0,Math.PI *2)
        //Fill the circle with color
        context.fill()
        //Draw a border around circle
        // context.lineWidth = 3;
        // context.strokeStyle = 'rgb(0,255,0)'
        // context.stroke()

    })

    //Recursively calls the function with every frame refresh
    requestAnimationFrame(draw)
}

canvas.addEventListener('mousemove',(event)=>{
    console.log(event)
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    let xVector;
    let yVector;
    if(angleDeg >= 0 && angleDeg < 90){
        console.log("lower quad")
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }

    let speed = 10
    let xV = xVector;
    let yV = yVector;

    if((player.locX < 5 && player.xVector < 0) || (player.locX > 500) && (xV > 0)){
        player.locY -= speed * yV;
    }else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
        player.locX += speed * xV;
    }else{
        player.locX += speed * xV;
        player.locY -= speed * yV;
    }
})
