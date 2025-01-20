/**Esentially the main class for gameplay purposes. Does all the heavy lifting, should be updated  */
class World
{
    width; height; depth;
    mapArray;

    //scene is essentially used to add new gameobjects to it.
    //May be implemented by world extending a scene, but that's not a big difference
    constructor(width, height, depth, scene)
    {
        this.width=width;
        this.height=height;
        this.depth=depth;

        this.#generateTerrain(scene);
    }

    #generateTerrain (scene) 
    {
        var arr1=[], arr2=[];
        this.mapArray=[];

       // for(let i=0; i<this.height; i++)
       //     arr2.push(new )
    }
}