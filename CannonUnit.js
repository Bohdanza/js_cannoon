class Cannon extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "cannon", mapX, mapY, screenX, screenY, false, "cannon_selected", 500, 500, 1, 5, 7, world);
        this.selectedAction=this.#shootAction;
        this.actionPoints=1;
    }

    damageUnit(scene, world, power)
    {
        super.damageUnit(scene, world, power);

        if(this.currentHP<0)
        {
            for(let i=-1; i<2; i++)
                for(let j=-1; j<1; j++)
                {
                    let rlc=world.mapToScreen(this.mapX+i, this.mapY+j);
                    let crp=new Corpse(scene, this.mapX+i, this.mapY+j, rlc[0], rlc[1], world, 0);
                    crp.activate(scene);
                    world.changeUnit(scene, this.mapX+i, this.mapY+j, crp);
                }
        }
    }

    #walkAction(scene, world, x, y)
    {}

    #shootAction(scene, world, x, y)
    {
        let rc=world.screenToMap(x, y);
        let mc=world.mapToScreen(rc[0], rc[1]);

        if(this.actionPoints>0&&world.inBounds(rc[0], rc[1])&&world.terrainArray[rc[0]][rc[1]].passable)
        {
            this.actionPoints--;
            world.useOnMapUnit(world.unitArray[rc[0]][rc[1]],
                function(parent){ return function(unit){unit.damageUnit(scene, world, parent.power)}}(this));
            
            (new Explosion(scene, rc[0], rc[1], mc[0], mc[1])).activate(scene);
        }
    }
    
    adjacentCoords()
    {
        return [[this.mapX-1, this.mapY-2], [this.mapX, this.mapY-2], [this.mapX+1, this.mapY-2], 
        [this.mapX-2, this.mapY], [this.mapX+2, this.mapY], [this.mapX-2, this.mapY-1], [this.mapX+2, this.mapY-1]];
    }
}