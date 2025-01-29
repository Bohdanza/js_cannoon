
/**Esentially the main class for gameplay purposes. Does all the heavy lifting, should be updated  */
class World
{
    width; height;
    #overlayImage;
    terrainArray=[];
    unitArray=[];
    collisionArray=[];
    currentWave=0;
    resource=0;
    #resourceTextField;
    selectedUnit=null;
    friendlyUnits=[];
    enemyUnits=[];
    existingUnits=[];

    agressivePhase=false;
    stopCalls=0;

    turnsSinceWave=100;
    currentWaveStrength=0;

    //scene is essentially used to add new gameobjects to it.
    //May be implemented by world extending a scene, but that's not a big difference
    constructor(width, height, scene)
    {
        this.width=width;
        this.height=height+3;
        
        this.#fillArrays(scene);
        this.#generateTerrain(scene);

      //  scr=this.mapToScreen(~~(this.width/2), this.height-4);
      //  this.#createUnit(scene, new EyeUnit(scene, ~~(this.width/2), this.height-4, scr[0], scr[1], this), true);

        this.#menuInit(scene);

        scene.input.keyboard.on('keydown-ENTER', 
            function(world)
            { 
                return function(event)
                {
                    world.startAgression(this, world);
                }; 
            }(this), scene);

        scene.input.on('pointerdown', this.#upclick(this), scene);
    }

    startAgression(scene, world)
    {
        if(!world.activePhase)
        {
            world.stopCalls=0;
            world.activePhase=true;

            for(let i=0; i<world.friendlyUnits.length; i++)
                world.friendlyUnits[i].actionPoints=0;
            
            world.turnsSinceWave++;

            if(world.turnsSinceWave>20)
            {
                world.turnsSinceWave=0;
                
                if(this.enemyUnits.length<this.currentWaveStrength*3)
                    world.spawnWave(scene, world.currentWaveStrength);
                
                world.currentWaveStrength++;
            }

            world.processEnemies(scene, world);

            world.stopAgression();
        }
    }

    stopAgression()
    {
        this.stopCalls++;

        if(this.stopCalls>=this.enemyUnits.length+1)
        {
            this.activePhase=false;
            for(let i=0; i<this.friendlyUnits.length; i++)
                this.friendlyUnits[i].actionPoints=this.friendlyUnits[i].speed;
        }
    }

    update()
    {
        for(let i=0; i<this.existingUnits.length; i++)
            this.existingUnits[i].update(this);
    }

    processEnemies(scene, world)
    {
        for(let i=0; i<world.enemyUnits.length; i++)
            if(this.enemyUnits[i].alive)
                world.enemyUnits[i].updateMovement(scene, world);
            else
            {
                world.enemyUnits.splice(i, 1);
                i--;
            }
    }

    #menuInit(scene)
    {    
        this.#overlayImage=scene.add.image(0, 0, 'menu_overlay');  
        this.#overlayImage.displayOriginX=0;
        this.#overlayImage.displayOriginY=0;
        this.#overlayImage.setScale(GLOBALSPRITESCALE);
        this.#overlayImage.setDepth(250);
        
        this.#resourceTextField=scene.add.text(1670, 1036, this.resource.toString(), {fontFamily: "mainFont", fontSize: "48px"});
        this.#resourceTextField.displayOriginY=this.#resourceTextField.height/2;
        this.#resourceTextField.setDepth(251);
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
                let rcc=this.mapToScreen(i, j);
                let rc=new Rock(scene, i, j, rcc[0], rcc[1]);
                rc.activate(scene);

                if(j<3)
                {
                    rc=new Ground(scene, i, j, rcc[0], rcc[1]);
                }

                arr1.push(rc);
                arr2.push(null);
                arr3.push(rc.passable);
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
                Math.floor(i*this.width/startPointsNumber+Math.random()*(this.width/startPointsNumber)), 3, 
                Math.floor(this.width/2), this.height);
        }

        this.#generateField(scene, ~~(this.width/2)-1, this.height, 4);

        startPointsNumber=randomInt(2, 6);

        for(let i=0; i<startPointsNumber; i++)
        {
            let cy=randomInt(3, this.height-5);
            this.#generateLake(scene, randomInt(0, this.width), cy, cy+randomInt(3, 10), 1, 15);
        }

        for(let i=0; i<this.width; i++)
            for(let j=3; j<this.height; j++)
                if(this.terrainArray[i][j] instanceof Water)
                    this.terrainArray[i][j].addBorders(scene, this);
        
        this.#addCannon(scene);
    }

    #createUnit(scene, unit, friend)
    {
        this.existingUnits.push(unit);

        if(friend)
            this.friendlyUnits.push(unit);
        else
            this.enemyUnits.push(unit);

        this.changeUnit(scene, unit.mapX, unit.mapY, unit);
        unit.activate(scene);
    } 

    #addCannon(scene)
    {
        let scr=this.mapToScreen(~~(this.width/2), this.height-1);
        let neu=new Cannon(scene, ~~(this.width/2), this.height-1, scr[0], scr[1], this);
        this.existingUnits.push(neu);
        this.friendlyUnits.push(neu);

        this.changeUnit(scene, neu.mapX, neu.mapY, neu);
        this.changeUnit(scene, neu.mapX-1, neu.mapY, neu);
        this.changeUnit(scene, neu.mapX+1, neu.mapY, neu);
        this.changeUnit(scene, neu.mapX-1, neu.mapY-1, neu);
        this.changeUnit(scene, neu.mapX, neu.mapY-1, neu);
        this.changeUnit(scene, neu.mapX+1, neu.mapY-1, neu);
        
        neu.activate(scene);
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
            let pr=this.mapToScreen(x+xstep, y);
            this.#changeBlock(scene, x+xstep, y, new Ground(scene, x+xstep, y, pr[0], pr[1]));

            for(let i=0; i<=distrVal[y-startY]; i++)
            {
                pr=this.mapToScreen(x, y);
                this.#changeBlock(scene, x, y, new Ground(scene, x, y, pr[0], pr[1]));
                pr=this.mapToScreen(x, y+1);
                this.#changeBlock(scene, x, y+1, new Ground(scene, x, y+1, pr[0], pr[1]));
                
                x+=xstep;
            }
            x-=xstep;
        }
    }

    #generateField(scene, centerX, centerY, radius)
    {
        for(let i=centerX-radius; i<=centerX+radius; i++)
        {
            let hgh=Math.round(Math.abs(Math.sin(Math.acos((centerX-i+0.5)/radius))*radius));

            for(let j=centerY-hgh; j<=centerY+hgh; j++)
            {
                let pr=this.mapToScreen(i, j);
                this.#changeBlock(scene, i, j, new Ground(scene, i, j, pr[0], pr[1]));
            }
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
            if(i==endY-1)
            {
                currentLeft=randomInt(maxWidth/4, maxWidth/3);
                currentRight=randomInt(maxWidth/4, maxWidth/3);
            }

            for(let j=Math.max(0, centerX-currentLeft); j<=Math.min(this.width-1, centerX+currentRight); j++)
            {
                if(this.terrainArray[j][i] instanceof Rock)
                {
                    let prc=this.mapToScreen(j, i);
                    this.#changeBlock(scene, j, i, new Water(scene, j, i, prc[0], prc[1]));
                }
            }
            
            currentLeft+=Math.round((-1*currentLeft+minWidth)*(maxWidth/3+1)/(maxWidth-minWidth)+randomInt(1, maxWidth/3+1));
            currentRight+=Math.round((-1*currentRight+minWidth)*(maxWidth/3+1)/(maxWidth-minWidth)+randomInt(1, maxWidth/3+1));
        }
    }

    mapToScreen(x, y)
    {
        return [x*32+16+GLOBALSPRITESCALE, y*32-64+GLOBALSPRITESCALE];
    }
    
    screenToMap(x, y)
    {
        return [~~((x-GLOBALSPRITESCALE)/32), ~~((y+96-GLOBALSPRITESCALE)/32)];
    }

    #changeBlock(scene, x, y, newBlock, array)
    {
        if(x>=this.width || y>=this.height || x<0 ||y<0)
            return;

        this.terrainArray[x][y].delete();
        this.terrainArray[x][y]=newBlock;
        newBlock.activate(scene);

        this.#updateCollision(x, y);
    }

    changeUnit(scene, x, y, newUnit)
    {
        if(x>=this.width || y>=this.height || x<0 ||y<0)
            return;

        if(this.unitArray[x][y]!=null)
            this.unitArray[x][y].delete();

        this.unitArray[x][y]=newUnit;

        this.#updateCollision(x, y);
    }

    deleteUnit(scene, x, y)
    {
        if(x>=this.width || y>=this.height || x<0 ||y<0)
            return;

        if(this.unitArray[x][y]!=null)
        {
            let ind=this.existingUnits.indexOf(this.unitArray[x][y]);

            if(ind!=-1)
            {
                this.existingUnits.splice(ind, 1);
            
                if(this.unitArray[x][y] instanceof FriendlyUnit)
                    this.friendlyUnits.splice(this.friendlyUnits.indexOf(this.unitArray[x][y]), 1);

                if(this.unitArray[x][y] instanceof EnemyUnit)
                    this.enemyUnits.splice(this.enemyUnits.indexOf(this.unitArray[x][y]), 1);
            }
            
            this.unitArray[x][y].delete();
            this.unitArray[x][y]=null;
        }

        this.#updateCollision(x, y);
    }

    transferUnit(x1, y1, x2, y2)
    {
        if(x1==x2&&y1==y2)
            return;

        if(x1>=this.width || y1>=this.height || x1<0 ||y1<0||
            x2>=this.width || y2>=this.height || x2<0 ||y2<0)
            return;

        if(this.unitArray[x2][y2]!=null)
            this.unitArray[x2][y2].delete();

        this.unitArray[x2][y2]=this.unitArray[x1][y1];
        this.unitArray[x1][y1]=null;

        this.#updateCollision(x1, y1);
        this.#updateCollision(x2, y2);
    }

    #updateCollision(x, y)
    {
        this.collisionArray[x][y]=this.terrainArray[x][y].passable;
        
        if(this.unitArray[x][y]!=null)
            this.collisionArray[x][y]=this.collisionArray[x][y]&&this.unitArray[x][y].passable;
    }

    #upclick(world)
    {
        return function(pointer)
        {
            if(pointer.leftButtonDown())
            {
                if(pointer.x>=GLOBALSPRITESCALE && pointer.y>=GLOBALSPRITESCALE &&
                    pointer.x<=GLOBALSPRITESCALE+world.width*8*GLOBALSPRITESCALE &&
                    pointer.y<=GLOBALSPRITESCALE+world.height*8*GLOBALSPRITESCALE)
                {
                    let mpcr=world.screenToMap(pointer.x, pointer.y);

                    world.useOnMapUnit(world.selectedUnit, 
                        function(requiredScene)
                        { 
                            return function(unitToApply) { unitToApply.deselectUnit(requiredScene); };
                        }(this));
                    
                    world.useOnMapUnit(world.unitArray[mpcr[0]][mpcr[1]], 
                        function(requiredScene)
                        { 
                            return function(unitToApply) { unitToApply.selectUnit(requiredScene); };
                        }(this));

                    world.selectedUnit=world.unitArray[mpcr[0]][mpcr[1]];
                }
            }
        }
    }

    useOnMapUnit(unitToUseOn, functionToUse)
    {
        if(unitToUseOn==null)
            return;
        else
            functionToUse(unitToUseOn);
    }

    #collisionCleanup()
    {
        for(let i=0; i<this.width; i++)
            for(let j=0; j<this.height; j++)
                this.collisionArray[i][j]=!(!this.collisionArray[i][j]);
    }

    findPath(startX, startY, endX, endY, maxPathLength)
    {
        if(startX==endX&&startY==endY)
            return [true, 0, [[startX, startY]]];

        if(this.collisionArray[endX][endY]==0||ManhattanDistance(startX, startY, endX, endY)>maxPathLength)
            return [false, 0, []];

        this.#collisionCleanup();

        let currentFrontier=[];
        currentFrontier.push([startX+1, startY]);
        currentFrontier.push([startX, startY+1]);
        currentFrontier.push([startX-1, startY]);
        currentFrontier.push([startX, startY-1]);

        this.collisionArray[startX][startY]=2;

        let clf=currentFrontier.length;

        for(let i=0; i<maxPathLength&&clf>0; i++)
        {
            let newFrontier=[];
            
            for(let j=0; j<clf; j++)
            {
                if(currentFrontier[j][0]>=0&&currentFrontier[j][0]<this.width&&
                    currentFrontier[j][1]>=0&&currentFrontier[j][1]<this.height&&
                    this.collisionArray[currentFrontier[j][0]][currentFrontier[j][1]]==1)
                {
                    this.collisionArray[currentFrontier[j][0]][currentFrontier[j][1]]=i+3;
                    
                    if(currentFrontier[j][0]==endX
                        &&currentFrontier[j][1]==endY)
                    {
                        return [true, i, 
                            this.#restorePath(startX, startY, endX, endY)];
                    }
                
                    newFrontier.push([currentFrontier[j][0]+1, currentFrontier[j][1]]);
                    newFrontier.push([currentFrontier[j][0], currentFrontier[j][1]+1]);
                    newFrontier.push([currentFrontier[j][0]-1, currentFrontier[j][1]]);
                    newFrontier.push([currentFrontier[j][0], currentFrontier[j][1]-1]);
                }
            }

            currentFrontier=newFrontier;
            clf=currentFrontier.length; 
        }

        return [false, 0, []];
    }

    #restorePath(startX, startY, endX, endY)
    {   
        let result=[];
        let x=endX, y=endY;

        while(x!=startX||y!=startY)
        {
            result.push([x, y]);
            
            if(x+1>=0&&x+1<this.width
                &&this.collisionArray[x+1][y]==this.collisionArray[x][y]-1)
                x++;
            else if(x-1>=0&&x-1<this.width
                &&this.collisionArray[x-1][y]==this.collisionArray[x][y]-1)
                x--;
            else if(y+1>=0&&y+1<this.height
                &&this.collisionArray[x][y+1]==this.collisionArray[x][y]-1)
                y++;
            else if(y-1>=0&&y-1<this.height
                &&this.collisionArray[x][y-1]==this.collisionArray[x][y]-1)
                y--;
        }

        return result;
    }

    inBounds(x, y)
    {
        return (x>=0&&y>=0&&x<this.width&&y<this.height);
    }

    spawnWave(scene, strength)
    {
        let wavePoints=strength*strength+3;
        let strongNumber=~~(wavePoints/6);
        let weakNumber=strongNumber*2+wavePoints-(strongNumber*6);

        for(let i=0; i<strongNumber; i++)
        {
            let xc=randomInt(0, this.width);
            let yc=randomInt(0, 3);

            let xcb=xc;
            let ycb=yc;

            while(!this.collisionArray[xc][yc]&&(yc+1)%3!=ycb)
            {
                yc++;
                yc%=3;

                while(!this.collisionArray[xc][yc]&&(xc+1)%this.width!=xcb)
                {
                    xc++;
                    xc%=this.width;
                }
            }

            if(this.collisionArray[xc][yc])
            {
                let tc=randomInt(0, 3);
                let mc=null;
                let rsc=this.mapToScreen(xc, yc);

                if(tc==0)
                    mc=new Magi(scene, xc, yc, rsc[0], rsc[1], this);
                else if(tc==1)
                    mc=new Cauldron(scene, xc, yc, rsc[0], rsc[1], this);
                else
                    mc=new Dino(scene, xc, yc, rsc[0], rsc[1], this);

                this.#createUnit(scene, mc, false);
                mc.activate(scene);
            }
        }

        //CODE COPYING, but YOU DON'T UNDERSTAND how LittlE I care at this point
        for(let i=0; i<weakNumber; i++)
        {
            let xc=randomInt(0, this.width);
            let yc=randomInt(0, 3);
    
            let xcb=xc;
            let ycb=yc;
    
            while(!this.collisionArray[xc][yc]&&(yc+1)%3!=ycb)
            {
                yc++;
                yc%=3;

                while(!this.collisionArray[xc][yc]&&(xc+1)%this.width!=xcb)
                {
                    xc++;
                    xc%=this.width;
                }
            }

            if(this.collisionArray[xc][yc])
            {
                let tc=randomInt(0, 3);
                let mc=null;
                let rsc=this.mapToScreen(xc, yc);
                mc=new Hound(scene, xc, yc, rsc[0], rsc[1], this);
    
                this.#createUnit(scene, mc, false);
                mc.activate(scene);
            }
        }
    }
}

function ManhattanDistance(x1, y1, x2, y2)   
{
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}