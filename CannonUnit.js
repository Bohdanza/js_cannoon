class Cannon extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "cannon", mapX, mapY, screenX, screenY, false, "cannon_selected", 500, 500, 1, 100, 7, world);
        this.selectedAction=this.#shootAction;
        this.actionPoints=100000;
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
}