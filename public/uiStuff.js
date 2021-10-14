let windowHeight = $(window).height();
let windowWidth = $(window).width();
let player = {} //all things related to the player
let orbs = [] //all things related to orbs
let players = [] //a list of all the players in the game


let canvas = document.querySelector('#the-canvas')
let context = canvas.getContext('2d')
canvas.width = windowWidth;
canvas.height = windowHeight;

$(window).load(()=>{
    //load the login modal when the game first loads in browser
    //PS: the .modal is a bootstrap method
    $('#loginModal').modal('show')

})

//Event listener: When click on play as guest button
$('.name-form').submit((event)=>{
    event.preventDefault();
    player.name = document.querySelector("#name-input").value
    $("#loginModal").modal("hide")
    $("#spawnModal").modal("show")
    document.querySelector('.player-name').innerHTML = player.name
})

$('.start-game').click((event)=>{
    $('.modal').modal('hide')
    $('.hiddenOnStart').removeAttr('hidden')
    init();
})

