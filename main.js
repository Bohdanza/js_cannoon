//Main class. Does all the heavy lifting: main loop,
//window resize handling etc.
class GameInstance
{
    #tickPause=16.66666;

    constructor()
    {
        this.canvas=document.getElementById("mainCanvas");
        this.glContext=this.canvas.getContext("webgl");

        this.glContext.clearColor(0, 0, 0, 255);
 
        this.#onResize();
        window.addEventListener('resize', ()=>{this.#onResize()});
        this.mainLoop();
    }

    #update()
    {
        
    }

    #draw()
    {    
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        //draw everything else
    }

    async mainLoop()
    {
        var dt1, dt2;

        while(1)
        {
            await new Promise((resolve, reject) => {dt1=(new Date()).getTime(); /*console.log(dt1);*/ resolve();});

            await new Promise((resolve, reject) => {this.#update(); resolve();});
            await new Promise((resolve, reject) => {this.#draw(); resolve();});

            await new Promise((resolve, reject) => {dt2=(new Date()).getTime(); resolve();});

            await new Promise((resolve, reject) => {setTimeout(()=>resolve(), Math.max(0, this.#tickPause-dt2+dt1))});
        }
    }

    //What we do if window is resized
    #onResize()
    {
        this.realWindowWidth=window.innerWidth;
        this.realWindowHeight=window.innerHeight;

        this.canvas.width=this.realWindowWidth;
        this.canvas.height=this.realWindowHeight;
    }
}

mainGameInstance = new GameInstance();