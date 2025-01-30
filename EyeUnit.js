class EyeUnit extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "eye", mapX, mapY, screenX, screenY, false, "eye_selected", 50, 50, 10000000000, 0, 10, world, "Eye");
    }
}

class Spike extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "spike", mapX, mapY, screenX, screenY, false, 
            "spike_selected", 100, 100, 5, 0, 10, world, "Wall");
    }
    
    naturalPriority()
    {
        return 20;
    }
}

class Bait extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "bait", mapX, mapY, screenX, screenY, false, 
            "bait_selected", 30, 30, 15, 0, 10, world, "Bait");
    }
    
    naturalPriority()
    {
        return 120;
    }
}

class Miner extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "miner", mapX, mapY, screenX, screenY, false, 
            "miner_selected", 60, 60, 8, 0, 10, world, "Miner");
    }

    generateDescription()
    {
        let st=super.generateDescription();
        return st+`\n\nGenerates $\nwhen standing\non crystal.`
    }

    updateOnTurn(world)
    {
        if(world.terrainArray[this.mapX][this.mapY] instanceof Crystal)
            world.increaseResource(1);
    }
}