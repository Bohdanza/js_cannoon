const GLOBALSPRITESCALE = 4;

document.body.style.overflow = 'hidden';

var config = 
{
    renderType: Phaser.WEBGL,
    antialias: false,
    canvasStyle: "top: 0px; position: absolute;",
    scale: 
    {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080,
    },
    fps: 
    {
        target: 60,
        forceSetTimeOut: true
    },
    scene: 
    {
        preload: preload,
        create: create,
        update: update
    }
};

function preload ()
{
    this.load.image('test', 'Content/testimage.png');
    this.load.spritesheet('ground', 'Content/ground.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('water', 'Content/water.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('rock', 'Content/rock.png', {frameWidth: 8, frameHeight: 12});

    this.load.image('menu_overlay', 'Content/menu_overlay.png');
}

function create ()
{
    for(let i=0; i<10; i++)
        this.anims.create
        (
            {
                key:'ground'+i.toString(),
                frames: this.anims.generateFrameNumbers('ground', {frames:[i]}),
                frameRate: 8,
                repeat:-1
            }
        );

    this.anims.create
    (
        {
            key:'water',
            frames: this.anims.generateFrameNumbers('water', {frames:[0,1,2]}),
            frameRate: 8,
            repeat:-1
        }
    );

    this.anims.create
    (
        {
            key:'rock0',
            frames: this.anims.generateFrameNumbers('rock', {frames:[0]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'rock1',
            frames: this.anims.generateFrameNumbers('rock', {frames:[1]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'rock2',
            frames: this.anims.generateFrameNumbers('rock', {frames:[2]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'rock3',
            frames: this.anims.generateFrameNumbers('rock', {frames:[3]}),
            frameRate: 8,
            repeat:-1
        }
    );

    new World(50, 33, this);
}

function update ()
{

}

/**
 * 
 * @param {int} min min value 
 * @param {int} max max value (excluding)
 * @returns int
 */
function randomInt(min, max)
{
    return Math.floor(Math.random()*(max-min)+min);
}

var game = new Phaser.Game(config);
