class Ground extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'ground', 'ground', mapX, mapY, screenX, screenY, true);
    }
}

class Water extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'water', 'water', mapX, mapY, screenX, screenY, false);
    }
}

class Rock extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'rock', 'rock', mapX, mapY, screenX, screenY, true);
    }
}