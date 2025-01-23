/**Esentially the main class for gameplay purposes. Does all the heavy lifting, should be updated  */
class World
{
    width; height;
    terrainArray=[];
    unitArray=[];
    collisionArray=[];

    //scene is essentially used to add new gameobjects to it.
    //May be implemented by world extending a scene, but that's not a big difference
    constructor(width, height, scene)
    {
        this.width=width;
        this.height=height;
        
        this.#generateTerrain(scene);
    }

    #generateTerrain (scene) 
    {
        for(let i=0; i<this.width; i++)
        {
            let arr1=[];

            for(let j=0; j<this.height; j++)
                arr1.push(new Rock(scene, i, j, i*32+16, j*32+32));

            this.terrainArray.push(arr1);
        }


    }
}