class MapUnit extends MapObject
{
    maxHP;
    currentHP;
    speed;
    power;

    constructor(scene, spriteAnimationName, spriteName, mapX, mapY, screenX, screenY, passable, maxHP, currentHP, speed, power)
    {
        if(this.constructor==MapObject)
            throw new Error("Abstract class can't be instantiated");

        
    }
}