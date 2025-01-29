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
}