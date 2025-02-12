class EnemyUnit extends MapUnit
{
    #attackScene;
    #unitToTarget;
    #attackUpdate=false;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
        maxHP, currentHP, speed, power, sight, world, personalName)
    {   
        super(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
            maxHP, currentHP, speed, power, sight, true, world, personalName);
    }

    damageUnit(scene, world, power)
    {
        this.currentHP-=power;
        this.updateDescription();

        if(this.currentHP<=0)
        {
            world.increaseKills(1);
            world.deleteUnit(scene, this.mapX, this.mapY);

            let crp=new Corpse(scene, this.mapX, this.mapY, this.screenX, this.screenY, world, 1);
            crp.activate(scene);
            world.changeUnit(scene, this.mapX, this.mapY, crp);
        }
    }

    updateAttack(scene, world)
    {
        let currentTarget=null;

        if(this.#unitToTarget!=null&&this.#unitToTarget.alive&&
            ManhattanDistance(this.mapX, this.mapY, this.#unitToTarget.mapX, this.#unitToTarget.mapY)==1)
        {
            currentTarget=this.#unitToTarget;
        }
        else
        {
            if(world.inBounds(this.mapX+1, this.mapY) && world.unitArray[this.mapX+1][this.mapY] instanceof FriendlyUnit)
                currentTarget=world.unitArray[this.mapX+1][this.mapY];
            else if(world.inBounds(this.mapX-1, this.mapY) && world.unitArray[this.mapX-1][this.mapY] instanceof FriendlyUnit)
                currentTarget=world.unitArray[this.mapX-1][this.mapY];
            else if(world.inBounds(this.mapX, this.mapY+1) && world.unitArray[this.mapX][this.mapY+1] instanceof FriendlyUnit)
                currentTarget=world.unitArray[this.mapX][this.mapY+1];
            else  if(world.inBounds(this.mapX, this.mapY-1) && world.unitArray[this.mapX][this.mapY-1] instanceof FriendlyUnit)
                currentTarget=world.unitArray[this.mapX][this.mapY-1];
        }

        if(currentTarget==null)
        {
            return;
        }

        currentTarget.damageUnit(scene, world, this.power);

        let rot=0;

        if(currentTarget.mapX<this.mapX)
            rot=0;
        else if(currentTarget.mapX>this.mapX)
            rot=2;
        else if(currentTarget.mapY<this.mapY)
            rot=1;
        else
            rot=3;

        this.queuedPlaces.push([this.screenX, this.screenY]);
        this.queuedPlaces.push([this.screenX+(currentTarget.mapX-this.mapX)*16, this.screenY+(currentTarget.mapY-this.mapY)*16]);

        let neu = new HitVisual(scene, this.mapX, this.mapY, this.screenX, this.screenY, rot*Math.PI/2);
        neu.activate(scene);

        return;
    }

    updateMovement(scene, world)
    {
        let priorities=[];

        for(let i=0; i<world.friendlyUnits.length; i++)
        {
            let cpr=world.friendlyUnits[i].naturalPriority();

            cpr+=world.friendlyUnits[i].mapY;
            
            let mhd=ManhattanDistance(this.mapX, this.mapY, world.friendlyUnits[i].mapX, world.friendlyUnits[i].mapY);
            cpr-=mhd*mhd;

            priorities.push([cpr, world.friendlyUnits[i]]);
        }

        priorities.sort(function(a, b){return b[0]-a[0];});

        this.#unitToTarget=null;

        for(let i=0; i<priorities.length; i++)
        {
            let wlk=this.#processWalking(scene, world, priorities[i][1]);

            if(wlk[0])
            {
                let endCoord=Math.max(0, wlk[1].length-1-this.speed);
                this.transferTo(world, wlk[1][endCoord][0], wlk[1][endCoord][1], 
                    wlk[1].slice(endCoord, wlk[1].length));

                return;
            }
        }

        this.#attackUpdate=true;
        return;
    }

    updateQueuedPlaces(world)
    {
        super.updateQueuedPlaces(world);

        if(this.#attackUpdate&&this.queuedPlaces.length<1)
        {
            this.#attackUpdate=false;
            this.updateAttack(this.#attackScene, world);
            world.stopAgression();
        }
    }

    #processWalking(scene, world, targetUnit)
    {
        let ltr=targetUnit.adjacentCoords();

        for(let i=0; i<ltr.length; i++)
        {
            if(world.inBounds(ltr[i][0], ltr[i][1]))
            {
                let pspt=world.findPath(this.mapX, this.mapY, ltr[i][0], ltr[i][1], 10000);
                
                if(pspt[0])
                {
                    this.#attackScene=scene;
                    this.#attackUpdate=true;
                    this.#unitToTarget=targetUnit;
                    return [true, pspt[2]];
                }
            }
        }

        return [false, []];
    }
}