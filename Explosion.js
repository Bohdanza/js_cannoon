class Explosion extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'explosion_anim', 'explosion', mapX, mapY, screenX, screenY, true);
    }
    
    activate(scene)
    {
        super.activate(scene);
        this.mySprite.setDepth(this.mapY*3+2)
        this.mySprite.on('animationcomplete', function(unit){return function() {unit.delete();};}(this));
    }
}

class HitVisual extends MapBlock
{
    #rotation;

    constructor(scene, mapX, mapY, screenX, screenY, rotation)
    {
        super(scene, 'hit_anim', 'hit', mapX, mapY, screenX, screenY, true);
        this.#rotation=rotation;
    }
    
    activate(scene)
    {
        super.activate(scene);
        this.mySprite.setDepth(this.mapY*3+2);
       // this.mySprite.setRotation(this.#rotation);
        this.mySprite.on('animationcomplete', function(unit){return function() {unit.delete();};}(this));
    }
}

class Corpse extends MapUnit
{
    #corpseType;

    constructor(scene, mapX, mapY, screenX, screenY, world, corpseType)
    {
        let tmpname='mech_';

        if(corpseType==1)
            tmpname="bio_";

        super(scene, tmpname+"corpse", mapX, mapY, screenX, screenY, true, tmpname+'corpse_selection',
            1, 1, 0, 0, 0, true, world, "Corpse");
        
        this.#corpseType=corpseType;
    }

    activate(scene)
    {
        this.mySprite=scene.add.sprite(this.screenX, this.screenY, this.mySpriteName);
        this.mySprite.setDepth(this.mapY*3);
        this.mySprite.displayOriginX=this.mySprite.width/2;
        this.mySprite.displayOriginY=this.mySprite.height;
        this.mySprite.play(this.mySpriteAnimName);

        this.mySprite.setScale(GLOBALSPRITESCALE);

        this.selectionFrame=scene.add.sprite(this.screenX, this.screenY, 'corpse_selected');

        this.selectionFrame.setDepth(99);
        this.selectionFrame.displayOriginX=this.selectionFrame.width/2;
        this.selectionFrame.displayOriginY=this.selectionFrame.height-1;
        this.selectionFrame.setScale(GLOBALSPRITESCALE);   

        this.selectionFrame.play(this.selectionFrameName);
        this.selectionFrame.visible=false;
        
        this.textField=scene.add.text(1625, 20, this.generateDescription(),
        {fontFamily: "mainFont", fontSize: "36px"});
        this.textField.displayOriginY=0;
        this.textField.displayOriginX=0;
        this.textField.setDepth(251);
        this.textField.visible=false;
    }
}