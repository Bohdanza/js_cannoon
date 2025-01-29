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
            cpr-=ManhattanDistance(this.mapX, this.mapY, world.friendlyUnits[i].mapX, world.friendlyUnits[i].mapY)*2;

            priorities.push([cpr, world.friendlyUnits[i]]);
        }

        priorities.sort(function(a, b){return a[0]-b[0];});
   
        console.log(priorities);
    }
}