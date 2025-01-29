class Magi extends EnemyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "magi", mapX, mapY, screenX, screenY, false, "magi_selected", 20, 20, 10, 25, 0, world);    
    }
}

class Hound extends EnemyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "hound", mapX, mapY, screenX, screenY, false, "hound_selected", 10, 10, 7, 5, 0, world);    
    }
}

class Cauldron extends EnemyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "cauldron", mapX, mapY, screenX, screenY, false, "cauldron_selected", 30, 30, 5, 15, 0, world);    
    }
}

class Dino extends EnemyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "dino", mapX, mapY, screenX, screenY, false, "dino_selected", 15, 15, 25, 10, 0, world);    
    }
}
