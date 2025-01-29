class EnemyUnit extends MapUnit
{
    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
        maxHP, currentHP, speed, power, sight, world)
    {   
        super(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
            maxHP, currentHP, speed, power, sight, true, world);
    }

    damageUnit(scene, world, power)
    {
        this.currentHP-=power;

        if(this.currentHP<0)
        {
            world.deleteUnit(scene, this.mapX, this.mapY);

            let crp=new Corpse(scene, this.mapX, this.mapY, this.screenX, this.screenY, world, 1);
            crp.activate(scene);
            world.changeUnit(scene, this.mapX, this.mapY, crp);
        }
    }

    updateMovement(scene, world)
    {
        let priorities=[];

        for(let i=0; i<world.friendlyUnits.length; i++)
        {
            let cpr=100;

            cpr+=world.friendlyUnits[i].mapY;
            
            let mhd=ManhattanDistance(this.mapX, this.mapY, world.friendlyUnits[i].mapX, world.friendlyUnits[i].mapY);
            cpr-=mhd*mhd;

            priorities.push([cpr, world.friendlyUnits[i]]);
        }

        priorities.sort(function(a, b){return b[0]-a[0];});
        console.log(priorities);
   
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

        return;
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
                    return [true, pspt[2]];
            }
        }

        return [false, []];
    }
}