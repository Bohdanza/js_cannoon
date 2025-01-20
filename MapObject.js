class MapObject
{
    mapX; mapY;
    screenX; screenY;
    mySpritesheet;
    passable;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable)
    {
        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");
    
        this.mapX=mapX;
        this.mapY=mapY;

        this.screenX=screenX;
        this.screenY=screenY;

        this.mySpritesheet=scene.add.sprite(screenX, screenY, spriteName);

        this.passable=passable;
    }

    update()
    {
        throw new Error("Abstract class can't be instantiated");
    }
}