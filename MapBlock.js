class MapBlock extends MapObject
{
    constructor (scene, spriteAnimationName, spriteName, mapX, mapY, screenX, screenY, passable)
    {
        super(scene, spriteAnimationName, spriteName, mapX, mapY, screenX, screenY, passable);

        if(this.constructor==MapBlock)
            throw new Error("Abstract class can't be instantiated");
    }
}