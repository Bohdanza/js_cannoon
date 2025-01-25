/**Esentially the main class for gameplay purposes. Does all the heavy lifting, should be updated  */
class World
{
    width; height;
    overlayImage;
    terrainArray=[];
    unitArray=[];
    collisionArray=[];

    //scene is essentially used to add new gameobjects to it.
    //May be implemented by world extending a scene, but that's not a big difference
    constructor(width, height, scene)
    {
        this.width=width;
        this.height=height;
        
        this.#fillArrays(scene);
        this.#generateTerrain(scene);
            
        this.overlayImage=scene.add.image(0, 0, 'menu_overlay');  
        this.overlayImage.displayOriginX=0;
        this.overlayImage.displayOriginY=0;
        this.overlayImage.setScale(GLOBALSPRITESCALE);
        this.overlayImage.setDepth(100);
    }

    #fillArrays(scene)
    {
        for(let i=0; i<this.width; i++)
        {
            let arr1=[];
            let arr2=[];
            let arr3=[];

            for(let j=0; j<this.height; j++)
            {
                let rcc=this.#mapToScreen(i, j);
                let rc=new Rock(scene, i, j, rcc[0], rcc[1]);
                rc.activate(scene);

                arr1.push(rc);
                arr2.push(null)
                arr3.push(0);
            }

            this.terrainArray.push(arr1);
            this.unitArray.push(arr2);
            this.collisionArray.push(arr3);
        }
    }

    #generateTerrain (scene) 
    {
        var startPointsNumber=5;

        for(let i=0; i<startPointsNumber; i++)
        {
            this.#generatePathway(scene, 
                Math.floor(i*this.width/startPointsNumber+Math.random()*(this.width/startPointsNumber)), 0, 
                Math.floor(this.width/2), this.height);
        }

        this.#generateLake(scene, 5, 10, this.height-10, 1, 15);
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
            let pr=this.#mapToScreen(x+xstep, y);
            this.#changeBlock(scene, x+xstep, y, new Ground(scene, x+xstep, y, pr[0], pr[1]));

            for(let i=0; i<=distrVal[y-startY]; i++)
            {
                pr=this.#mapToScreen(x, y);
                this.#changeBlock(scene, x, y, new Ground(scene, x, y, pr[0], pr[1]));
                pr=this.#mapToScreen(x, y+1);
                this.#changeBlock(scene, x, y+1, new Ground(scene, x, y+1, pr[0], pr[1]));
                
                x+=xstep;
            }
            x-=xstep;
        }
    }

    #generateLake(scene, centerX, startY, endY, minWidth, maxWidth)
    {
        if(startY>endY)
            startY = [endY, endY = startY][0];

        var currentLeft=~~(maxWidth/4);
        var currentRight=~~(maxWidth/4);

        for(let i=startY; i<endY; i++)
        {
            for(let j=Math.max(0, centerX-currentLeft); j<=Math.min(this.width-1, centerX+currentRight); j++)
            {
                if(this.terrainArray[j][i] instanceof Rock)
                {
                    let prc=this.#mapToScreen(j, i);
                    this.#changeBlock(scene, j, i, new Water(scene, j, i, prc[0], prc[1]));
                }
            }
            
            currentLeft+=Math.round((-1*currentLeft+minWidth)*(maxWidth/3+1)/(maxWidth-minWidth)+randomInt(1, maxWidth/3+1));
            currentRight+=Math.round((-1*currentRight+minWidth)*(maxWidth/3+1)/(maxWidth-minWidth)+randomInt(1, maxWidth/3+1));
        }
    }

    #mapToScreen(x, y)
    {
        return [x*32+16+GLOBALSPRITESCALE, y*32+32+GLOBALSPRITESCALE];
    }

    #changeBlock(scene, x, y, newBlock)
    {
        if(x>=this.width || y>=this.height || x<0 ||y<0)
            return;

        this.terrainArray[x][y].delete();
        this.terrainArray[x][y]=newBlock;
        newBlock.activate(scene);

        this.#updateCollision(x, y);
    }

    #updateCollision(x, y)
    {
        this.collisionArray[x][y]=this.terrainArray[x][y].passable;
        
        if(this.unitArray[x][y]!=null)
            this.collisionArray[x][y]=this.collisionArray[x][y]&&this.unitArray[x][y].passable;
    }
}