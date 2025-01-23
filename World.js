/**Esentially the main class for gameplay purposes. Does all the heavy lifting, should be updated  */
class World
{
    width; height;
    terrainArray=[];
    unitArray=[];
    collisionArray=[];

    //scene is essentially used to add new gameobjects to it.
    //May be implemented by world extending a scene, but that's not a big difference
    constructor(width, height, scene)
    {
        this.width=width;
        this.height=height;
        
        this.#generateTerrain(scene);
    }

    #generateTerrain (scene) 
    {
        for(let i=0; i<this.width; i++)
        {
            let arr1=[];

            for(let j=0; j<this.height; j++)
                arr1.push(new Rock(scene, i, j, i*32+16, j*32+32));

            this.terrainArray.push(arr1);
        }

        var startPointsArr=[], startPointsNumber=5;

        for(let i=0; i<startPointsNumber; i++)
        {
            this.#generatePathway(scene, 
                Math.floor(i*this.width/startPointsNumber+Math.random()*(this.width/startPointsNumber)), 0, 
                Math.floor(this.width/2), this.height);
        }
    }

    #generatePathway(scene, startX, startY, endX, endY)
    {
        if(startY>endY)
            startY = [endY, endY = startY][0];

        var xdif=Math.abs(startX-endX), ydif=Math.abs(startY-endY);
        var xstep=(endX>startX)*2-1;
        var distrVal=[];
        distrVal.length=ydif;
        distrVal.fill(0);

        for(let i=0; i<xdif; i++)
            distrVal[Math.floor(Math.random()*(ydif+0.99999))]++;
    
        let x=startX;
        for(let y=startY; y<=endY; y++)
        {
            for(let i=0; i<=distrVal[y-startY]; i++)
            {
                let pr=this.#mapToScreen(x, y);

                this.#changeBlock(x, y, new Ground(scene, x, y, pr[0], pr[1]));
                x+=xstep;
            }
            x-=xstep;
        }
    }

    #mapToScreen(x, y)
    {
        return [x*32+16, y*32+32];
    }

    #changeBlock(x, y, newBlock)
    {
        if(x>this.width || y>this.height)
            return;

        this.terrainArray[x][y].delete();
        this.terrainArray[x][y]=newBlock;
    }
}