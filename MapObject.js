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

        this.mySprite=scene.add.sprite(screenX, screenY, spriteName);
        this.mySprite.setDepth(mapY);
        this.mySprite.displayOriginX=this.mySprite.width/2;
        this.mySprite.displayOriginY=this.mySprite.height;
        this.mySprite.play(spriteAnimationName);

        this.mySprite.setScale(GLOBALSPRITESCALE);   

        this.passable=passable;
    }

    update()
    {
        throw new Error("Abstract class can't be instantiated");
    }

    delete()
    {
        this.mySprite.destroy(true);
     //   this.destroy(true);
    }
}