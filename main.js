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
    this.load.spritesheet('ground', 'Content/ground.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('water', 'Content/water.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('rock', 'Content/rock.png', {frameWidth: 8, frameHeight: 12});
    this.load.spritesheet('eye', 'Content/eye.png', {frameWidth: 6, frameHeight: 8});
    this.load.spritesheet('eye_selected', 'Content/eye_select.png', {frameWidth: 8, frameHeight: 10});

    this.load.image('menu_overlay', 'Content/menu_overlay.png');
}

function create()
{
    this.input.mouse.disableContextMenu();

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
        
    for(let i=0; i<4; i++)
        this.anims.create
        (
            {
                key:'rock'+i.toString(),
                frames: this.anims.generateFrameNumbers('rock', {frames:[i]}),
                frameRate: 8,
                repeat:-1
            }
        );

    this.anims.create
    (
        {
            key:'water',
            frames: this.anims.generateFrameNumbers('water', {frames:[0,1,2,3,4,5]}),
            frameRate: 8,
            repeat:-1
        }
    );

    this.anims.create
    (
        {
            key:'eye_idle',
            frames: this.anims.generateFrameNumbers('eye', {frames:[0, 1, 2]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'eye_selected_idle',
            frames: this.anims.generateFrameNumbers('eye_selected', {frames:[0,1,2]}),
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

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        throw error;
    });
}

var game = new Phaser.Game(config);
