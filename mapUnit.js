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
    friendly;
    myWorld;
    actionPoints;
    queuedPlaces=[];

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName, maxHP, currentHP, speed, power, sight,
        friendly, world)
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
        this.friendly=friendly;
        this.myWorld=world;
        this.actionPoints=speed;
    }

    update()
    {
        this.#updateQueuedPlaces();
    }

    #movingToPlace=false;
    #movingAnimSpeed=1;

    #updateQueuedPlaces()
    {
        if(this.#movingToPlace)
        {
            let xdf=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][0]-this.screenX);
            let ydf=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][1]-this.screenY);
            
            this.screenX+=this.#movingAnimSpeed*xdf;
            this.screenY+=this.#movingAnimSpeed*ydf;

            let xdf1=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][0]-this.screenX);
            let ydf1=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][1]-this.screenY);
            let xb1=false, yb1=false;

            if(xdf!=xdf)
            {
                xb1=true;
                this.screenX=this.queuedPlaces[this.queuedPlaces.length-1][0];
            }

            if(ydf!=ydf)
            {
                yb1=true;
                this.screenY=this.queuedPlaces[this.queuedPlaces.length-1][1];
            }

            if(yb1&&xb1)
            {
                this.mySprite.setDepth(this.queuedPlaces[this.queuedPlaces.length-1][1]*2+1);
                this.#movingToPlace=false;
                this.queuedPlaces.pop();
            }
        }

        if(!this.#movingToPlace && this.queuedPlaces.length>0)
        {
            this.#movingToPlace=true;
            this.mySprite.setDepth(Math.max(this.mySprite.depth, this.queuedPlaces[this.queuedPlaces.length-1][1]*2+1));
        }
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

    walkTo(scene, world, x, y)
    {
        let rs=world.findPath(this.mapX, this.mapY, x, y, this.speed);

        if(rs[0])
        {
            this.queuedPlaces=rs[2];

            for(let i=0; i<this.queuedPlaces.length; i++)
                this.queuedPlaces[i]=world.mapToScreen(this.queuedPlaces[i][0], this.queuedPlaces[i][1]);

            this.actionPoints-=rs[1];
            world.transferUnit(this.mapX, this.mapY, x, y);
            this.#movingToPlace=true;
        }
    }
}