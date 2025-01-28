class Explosion extends MapBlock
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, 'explosion_anim', 'explosion', mapX, mapY, screenX, screenY, true);
    }
    
    activate(scene)
    {
        super.activate(scene);
        this.mySprite.setDepth(this.mapY*3+2)
        this.mySprite.on('animationcomplete', function(unit){return function() {unit.delete();};}(this));
    }
}
