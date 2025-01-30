class FriendlyUnit extends MapUnit
{
    selectedAction;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
        maxHP, currentHP, speed, power, sight, world, personalName)
    {
        super(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
            maxHP, currentHP, speed, power, sight, true, world, personalName);
        
        this.selectedAction=this.#walkAction;

        scene.input.on('pointerdown', 
            function(scene) 
            { 
                return function(pointer){this.#click(scene, pointer);};
            }(scene), this);
    }

    damageUnit(scene, world, power)
    {
        this.currentHP-=power;
        this.updateDescription();

        if(this.currentHP<=0)
        {
            world.deleteUnit(scene, this.mapX, this.mapY);

            let crp=new Corpse(scene, this.mapX, this.mapY, this.screenX, this.screenY, world, 0);
            crp.activate(scene);
            world.changeUnit(scene, this.mapX, this.mapY, crp);
        }
    }

    #click(scene, pointer)
    {
        if(pointer.rightButtonDown()&&this.selected)
            this.selectedAction(scene, this.myWorld, pointer.x, pointer.y);
    }

    #walkAction(scene, world, x, y)
    {
        let rlccrd=world.screenToMap(x, y);
        this.walkTo(scene, world, rlccrd[0], rlccrd[1]);
    }

    naturalPriority()
    {
        return 100;
    }

    updateOnTurn(world)
    {}

    #noAction(scene, world, x, y)
    {}
}