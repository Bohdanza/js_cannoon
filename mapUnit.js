class MapUnit extends MapObject
{
    menuButtons=[];
    
    selected=false;
    maxHP;
    currentHP;
    speed;
    power;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, maxHP, currentHP, speed, power)
    {
        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");

        super(scene, spriteName+"_idle", spriteName, mapX, mapY, screenX, screenY, passable);

        this.maxHP=maxHP;
        this.currentHP=currentHP;
        this.speed=speed;
        this.power=power;
    }

    select(scene)
    {
        this.selected=true;
    }

    #drawMenu(scene)
    {}
}