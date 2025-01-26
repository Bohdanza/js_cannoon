class FriendlyUnit extends MapUnit
{
    selectedAction=this.#noAction;

    constructor(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName, maxHP, currentHP, speed, power, sight, world)
    {
        super(scene, spriteName, mapX, mapY, screenX, screenY, passable, selectionFrameName,
            maxHP, currentHP, speed, power, sight, true, world);
        
        scene.input.on('pointerdown', 
            function(scene) 
            { 
                return function(pointer){this.#click(scene, pointer);};
            }(scene), this);
    }

    #click(scene, pointer)
    {
        if(pointer.rightButtonDown()&&this.selected)
            this.selectedAction(scene, this.myWorld, pointer.x, pointer.y);
    }

    #noAction(scene, world, x, y)
    {}
}