class EyeUnit extends MapUnit
{
    constructor(scene, mapX, mapY, screenX, screenY)
    {
        super(scene, "eye", mapX, mapY, screenX, screenY, false, "eye_selected", 50, 50, 5, 0, 10);
    }
}