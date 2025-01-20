class Ground extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        console.log("here is ground!");

        super(scene, "Content\\ground.png", mapX, mapY, screenX, screenY, true);
    }
}