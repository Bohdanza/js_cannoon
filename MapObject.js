class MapObject
{
    mapX; mapY;
    screenX; screenY;
    mySprite;
    passable;

    constructor(scene, spriteAnimationName, spriteName, mapX, mapY, screenX, screenY, passable)
    {
        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");
    
        this.mapX=mapX;
        this.mapY=mapY;

        this.screenX=screenX;
        this.screenY=screenY;

        this.mySprite=scene.add.sprite(screenX, screenY, spriteName).setScale(10);
        this.mySprite.play(spriteAnimationName);

        this.passable=passable;
    }

    update()
    {
        throw new Error("Abstract class can't be instantiated");
    }
}