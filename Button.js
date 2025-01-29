class Button
{
    #functionToUse;
    screenX;
    screenY;

    hitboxX;
    hitboxY;

    hitboxWidth;
    hitboxHeight;

    mySprite;
    mySpriteName;

    constructor(scene, screenX, screenY, x, y, width, height, functionToUse, spriteName)
    {
        functionToUse=functionToUse;
        this.mySpriteName=spriteName;
        
        this.screenX=screenX;
        this.screenY=screenY;

        this.hitboxX=x;
        this.hitboxY=y;

        this.hitboxWidth=width;
        this.hitboxHeight=height;
    }

    activate(scene)
    {
        this.mySprite=scene.add.sprite(this.screenX, this.screenY, this.mySpriteName);
        this.mySprite.setDepth(300);
        this.mySprite.displayOriginX=0;
        this.mySprite.displayOriginY=0;
        this.mySprite.play(this.mySpriteName);

        this.mySprite.setScale(GLOBALSPRITESCALE);   
    }
}