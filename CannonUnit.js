class Cannon extends FriendlyUnit
{
    powerPlusCost=10;
    shotPlusCost=20;
    minerCost=15;
    baitCost=10;
    wallCost=10;

    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "cannon", mapX, mapY, screenX, screenY, false, "cannon_selected", 500, 500, 1, 4, 7, world,
            "Cannon");
        this.selectedAction=this.#shootAction;
        this.actionPoints=1;


        scene.input.keyboard.on('keydown-ZERO', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.zeroAction(scene, world);
                }; 
            }(scene, world), this);

        scene.input.keyboard.on('keydown-ONE', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.oneAction(scene, world);
                }; 
            }(scene, world), this);
            
        scene.input.keyboard.on('keydown-TWO', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.twoAction(scene, world);
                };
            }(scene, world), this);
        
        scene.input.keyboard.on('keydown-THREE', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.threeAction(scene, world);
                }; 
            }(scene, world), this);

        scene.input.keyboard.on('keydown-FOUR', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.fourAction(scene, world);
                }; 
            }(scene, world), this);
            
        scene.input.keyboard.on('keydown-FIVE', 
            function(scene, world)
            { 
                return function(event)
                {
                    this.fiveAction(scene, world);
                };
            }(scene, world), this);
    }

    zeroAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=1&&this.currentHP<this.maxHP)
        {
            world.increaseResource(-1);
            this.changeCurrentHP(Math.min(this.maxHP, this.currentHP+2));
        }
    }

    oneAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=this.powerPlusCost)
        {
            world.increaseResource(-this.powerPlusCost);
            this.powerPlusCost=~~(this.powerPlusCost*1.5);
            this.changePower(this.power+1);
        }
    }
    
    twoAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=this.shotPlusCost)
        {
            world.increaseResource(-this.shotPlusCost);
            this.shotPlusCost*=3;
            this.changeSpeed(this.speed+1);
        }
    }
    
    threeAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=this.minerCost)
        {
            let tsc=this.freeNeighbouringSpace(world);

            if(tsc[0])
            {
                let tstrc=world.mapToScreen(tsc[1], tsc[2]);

                world.increaseResource(-this.minerCost);
                world.createUnit(scene, new Miner(scene, tsc[1], tsc[2], tstrc[0], tstrc[1], world), true);
            }
        }
    }

    fourAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=this.baitCost)
        {
            let tsc=this.freeNeighbouringSpace(world);

            if(tsc[0])
            {
                let tstrc=world.mapToScreen(tsc[1], tsc[2]);

                world.increaseResource(-this.baitCost);
                world.createUnit(scene, new Bait(scene, tsc[1], tsc[2], tstrc[0], tstrc[1], world), true);
            }
        }
    }
    
    fiveAction(scene, world)
    {
        if(!world.activePhase&&this.selected&&world.resource>=this.wallCost)
        {
            let tsc=this.freeNeighbouringSpace(world);

            if(tsc[0])
            {
                let tstrc=world.mapToScreen(tsc[1], tsc[2]);

                world.increaseResource(-this.wallCost);
                world.createUnit(scene, new Spike(scene, tsc[1], tsc[2], tstrc[0], tstrc[1], world), true);
            }
        }
    }

    freeNeighbouringSpace(world)
    {
        let tst=this.adjacentCoords();

        for(let i=0; i<tst.length; i++)
        {
            if(world.collisionArray[tst[i][0]][tst[i][1]])
                return [true, tst[i][0], tst[i][1]];
        }

        return [false, 0, 0];
    }

    generateDescription()
    {
        let st=super.generateDescription();
        return st+`\n\nUpgrades:\n\n[0]: Repair, 1$\n[1]: +1 ATK, ${this.powerPlusCost} $.\n[2]: +1 AP, ${this.shotPlusCost} $.\n\nProduction:\n\n[3]: Miner, ${this.minerCost} $.\n[4]: Bait, ${this.baitCost} $.\n[5]: Wall, ${this.wallCost} $.`
    }

    damageUnit(scene, world, power)
    {
        super.damageUnit(scene, world, power);

        if(this.currentHP<=0)
        {
            for(let i=-1; i<2; i++)
                for(let j=-1; j<1; j++)
                {
                    let rlc=world.mapToScreen(this.mapX+i, this.mapY+j);
                    let crp=new Corpse(scene, this.mapX+i, this.mapY+j, rlc[0], rlc[1], world, 0);
                    crp.activate(scene);
                    world.changeUnit(scene, this.mapX+i, this.mapY+j, crp);
                }
        }
    }

    #walkAction(scene, world, x, y)
    {}

    #shootAction(scene, world, x, y)
    {
        let rc=world.screenToMap(x, y);
        let mc=world.mapToScreen(rc[0], rc[1]);

        if(this.actionPoints>0&&world.inBounds(rc[0], rc[1])&&world.terrainArray[rc[0]][rc[1]].passable)
        {
            this.changeActionPoints(this.actionPoints-1);
            world.useOnMapUnit(world.unitArray[rc[0]][rc[1]],
                function(parent){ return function(unit){unit.damageUnit(scene, world, parent.power)}}(this));
            
            (new Explosion(scene, rc[0], rc[1], mc[0], mc[1])).activate(scene);
        }
    }
    
    adjacentCoords()
    {
        return [[this.mapX-1, this.mapY-2], [this.mapX, this.mapY-2], [this.mapX+1, this.mapY-2], 
        [this.mapX-2, this.mapY], [this.mapX+2, this.mapY], [this.mapX-2, this.mapY-1], [this.mapX+2, this.mapY-1]];
    }
}