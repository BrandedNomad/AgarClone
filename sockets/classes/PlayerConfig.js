/**
 * @overview PlayerConfig contains all the data that only the server needs to know, and not the players
 */

class PlayerConfig {
    constructor(settings){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;
    }
}

module.exports = PlayerConfig;
