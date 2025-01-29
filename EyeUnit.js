class EyeUnit extends FriendlyUnit
{
    constructor(scene, mapX, mapY, screenX, screenY, world)
    {
        super(scene, "eye", mapX, mapY, screenX, screenY, false, "eye_selected", 50, 50, 10000000000, 0, 10, world, "Eye");
    }
}