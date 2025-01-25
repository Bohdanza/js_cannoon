class MapObject
{
    mapX; mapY;
    screenX; screenY;
    mySprite;
    mySpriteName;
    mySpriteAnimName;
    passable;

    constructor(scene, spriteAnimationName, spriteName, mapX, mapY, screenX, screenY, passable)
    {
        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");
    
        this.mySpriteName=spriteName;
        this.mySpriteAnimName=spriteAnimationName;

        this.mapX=mapX;
        this.mapY=mapY;

        this.screenX=screenX;
        this.screenY=screenY;

        this.passable=passable;
    }

    update()
    {
        throw new Error("Abstract class can't be instantiated");
    }

    activate(scene)
    {
        this.mySprite=scene.add.sprite(this.screenX, this.screenY, this.mySpriteName);
        this.mySprite.setDepth(this.mapY);
        this.mySprite.displayOriginX=this.mySprite.width/2;
        this.mySprite.displayOriginY=this.mySprite.height;
        this.mySprite.play(this.mySpriteAnimName);

        this.mySprite.setScale(GLOBALSPRITESCALE);   
    }

    delete()
    {
        this.mySprite.destroy(true);
     //   this.destroy(true);
    }
}