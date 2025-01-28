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
    #borders=[];

    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'water', 'water', mapX, mapY, screenX, screenY, false);
    }

    addBorders(scene, world)
    {
        if(this.mapX-1>=0&&!(world.terrainArray[this.mapX-1][this.mapY] instanceof Water))
            this.#addBorder(scene, world, 2);
        
        if(this.mapX+1<world.width&&!(world.terrainArray[this.mapX+1][this.mapY] instanceof Water))
            this.#addBorder(scene, world, 3);
        
        if(this.mapY-1>=0&&!(world.terrainArray[this.mapX][this.mapY-1] instanceof Water))
            this.#addBorder(scene, world, 0);
        
        if(this.mapY+1<world.height&&!(world.terrainArray[this.mapX][this.mapY+1] instanceof Water))
            this.#addBorder(scene, world, 1);
    }

    #addBorder(scene, world, type)
    {
        let lstbrd=scene.add.sprite(this.screenX, this.screenY, "waterlines");
        lstbrd.setDepth(this.mapY*2+1);
        lstbrd.displayOriginX=this.mySprite.width/2;
        lstbrd.displayOriginY=this.mySprite.height;
        lstbrd.play("waterline"+type.toString());
        lstbrd.setScale(GLOBALSPRITESCALE);   

        this.#borders.push(lstbrd);
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