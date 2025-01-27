class Cannon extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "cannon", mapX, mapY, screenX, screenY, false, "cannon_selected", 500, 500, 0, 5, 7, world);
        this.selectedAction=this.#shootAction;
    }

    #shootAction(scene, world, x, y)
    {
        
    }
}