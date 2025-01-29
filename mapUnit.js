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
    #personalName;
    textField;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName, maxHP, currentHP,
        speed, power, sight, friendly, world, personalName)
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
        this.#personalName=personalName;
    }

    update(world)
    {
        this.updateQueuedPlaces(world);
    }

    #movingToPlace=false;
    #movingAnimSpeed=7;

    updateQueuedPlaces(world)
    {
        if(this.#movingToPlace)
        {
            let xdf=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][0]-this.screenX);
            let ydf=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][1]-this.screenY);
            
            this.screenX+=this.#movingAnimSpeed*xdf;
            this.screenY+=this.#movingAnimSpeed*ydf;

            let xdf1=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][0]-this.screenX);
            let ydf1=Math.sign(this.queuedPlaces[this.queuedPlaces.length-1][1]-this.screenY);

            if(xdf!=xdf1)
                this.screenX=this.queuedPlaces[this.queuedPlaces.length-1][0];

            if(ydf!=ydf1)
                this.screenY=this.queuedPlaces[this.queuedPlaces.length-1][1];

            if(this.screenX==this.queuedPlaces[this.queuedPlaces.length-1][0]&&
                this.screenY==this.queuedPlaces[this.queuedPlaces.length-1][1])
            {
                let qpd=world.screenToMap(0, this.queuedPlaces[this.queuedPlaces.length-1][1]);
                this.mySprite.setDepth(qpd[1]*3+1);
                this.#movingToPlace=false;
                this.queuedPlaces.pop();
            }

            this.updateSpriteCoords();
        }

        if(!this.#movingToPlace)
        {
            if(this.queuedPlaces.length>0)
                this.#movingToPlace=true;
            else
                this.mySprite.setDepth(this.mapY*3+1);
        }
    }

    updateSpriteCoords()
    {
        super.updateSpriteCoords();
        this.selectionFrame.x=this.screenX;
        this.selectionFrame.y=this.screenY;
    }

    activate(scene)
    {
        super.activate(scene);
        this.mySprite.setDepth(this.mapY*3+1);

        this.selectionFrame=scene.add.sprite(this.screenX, this.screenY, this.selectionFrameName);

        this.selectionFrame.setDepth(200);
        this.selectionFrame.displayOriginX=this.selectionFrame.width/2;
        this.selectionFrame.displayOriginY=this.selectionFrame.height-1;
        this.selectionFrame.setScale(GLOBALSPRITESCALE);

        this.selectionFrame.play(this.selectionFrameName+"_idle");
        this.selectionFrame.visible=false;

        this.textField=scene.add.text(1625, 20, this.generateDescription(),
        {fontFamily: "mainFont", fontSize: "36px"});
        this.textField.displayOriginY=0;
        this.textField.displayOriginX=0;
        this.textField.setDepth(251);
        this.textField.visible=false;
    }

    updateDescription()
    {
        let st=this.generateDescription();
        this.textField.setText(st);
    }

    generateDescription()
    {
        let st=this.#personalName+
        `\n\nHP: ${this.currentHP}/${this.maxHP}\nAP: ${this.actionPoints}/${this.speed}\nATK: ${this.power}`;
        return st;
    }

    changeActionPoints(newPoints)
    {
        this.actionPoints=newPoints;
        this.updateDescription();
    }

    changeAction(action)
    {
        this.mySprite.play(this.mySpriteName+action);
        this.selectionFrame.play(this.selectionFrameName+action);
    }

    show()
    {
        this.mySprite.visible=true;
        this.textField.visible=true;
    }

    hide()
    {
        this.mySprite.visible=false;
        this.textField.visible=false;
        this.deselect();
    }

    selectUnit(scene)
    {
        this.selected=true;
        this.selectionFrame.visible=true;
        this.textField.visible=true;
    }

    deselectUnit(scene)
    {
        this.selected=false;
        this.selectionFrame.visible=false;
        this.textField.visible=false;
    }

    #drawMenu(scene)
    {}

    delete()
    {
        super.delete();
        this.selectionFrame.destroy(true);
        this.textField.destroy(true);
        this.selected=false;
    }

    walkTo(scene, world, x, y)
    {
        if(this.queuedPlaces.length>0)
            return false;

        let rs=world.findPath(this.mapX, this.mapY, x, y, this.speed);

        if(rs[0])
        {
            this.actionPoints-=rs[1];
            this.transferTo(world, x, y, rs[2]);
        }

        return rs[0];
    }

    transferTo(world, x, y, pathArray)
    {
        for(let i=0; i<pathArray.length; i++)
            pathArray[i]=world.mapToScreen(pathArray[i][0], pathArray[i][1]);

        this.queuedPlaces=pathArray.concat(this.queuedPlaces);

        world.transferUnit(this.mapX, this.mapY, x, y);
        this.mapX=x; this.mapY=y;
        this.#movingToPlace=true;
    }

    damageUnit(scene, world, power)
    {
        this.currentHP-=power;

        if(this.currentHP<0)
        {
            //TODO: corpses
            world.deleteUnit(scene, this.mapX, this.mapY);
        }
    }

    adjacentCoords()
    {
        return [[this.mapX-1, this.mapY], [this.mapX+1, this.mapY], [this.mapX, this.mapY-1], [this.mapX, this.mapY+1]];
    }
}