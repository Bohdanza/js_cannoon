class MapUnit extends MapObject
{
    menuButtons=[];
    
    selected=false;
    selectionFrame;
    selectionFrameName;
    maxHP;
    currentHP;
    speed;
    power;
    sight;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName, maxHP, currentHP, speed, power, sight)
    {
        super(scene, spriteName+"_idle", spriteName, mapX, mapY, screenX, screenY, passable);

        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");

        this.selectionFrameName=selectionFrameName;
        this.maxHP=maxHP;
        this.currentHP=currentHP;
        this.speed=speed;
        this.power=power;
        this.sight=sight;
    }

    activate(scene)
    {
        super.activate(scene);
        this.mySprite.setDepth(this.mapY*2+1);

        this.selectionFrame=scene.add.sprite(this.screenX, this.screenY, this.selectionFrameName);

        this.selectionFrame.setDepth(99);
        this.selectionFrame.displayOriginX=this.selectionFrame.width/2;
        this.selectionFrame.displayOriginY=this.selectionFrame.height-1;
        this.selectionFrame.setScale(GLOBALSPRITESCALE);   

        this.selectionFrame.play(this.selectionFrameName+"_idle");
        this.selectionFrame.visible=false;
    }

    changeAction(action)
    {
        this.mySprite.play(this.mySpriteName+action);
        this.selectionFrame.play(this.selectionFrameName+action);
    }

    show()
    {
        this.mySprite.visible=true;
    }

    hide()
    {
        this.mySprite.visible=false;
        this.deselect();
    }

    selectUnit(scene)
    {
        this.selected=true;
        this.selectionFrame.visible=true;
    }

    deselectUnit(scene)
    {
        this.selected=false;
        this.selectionFrame.visible=false;
    }

    #drawMenu(scene)
    {}

    delete()
    {
        super.delete();
        this.selectionFrame.destroy(true);
    }
}