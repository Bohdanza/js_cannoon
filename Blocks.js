class Ground extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        let animn = 'ground'+(~~(Math.random()*9.9999)).toString();
        super(scene, animn, 'ground', mapX, mapY, screenX, screenY, true);
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
        let animn = 'rock'+(~~(Math.random()*3.9999)).toString();

        super(scene, animn, 'rock', mapX, mapY, screenX, screenY, true);
    }
}