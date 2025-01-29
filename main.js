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
    this.load.spritesheet('explosion', 'Content/explosion.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('waterlines', 'Content/water_borders.png', {frameWidth: 8, frameHeight: 8});

    this.load.spritesheet('cannon', 'Content/cannon.png', {frameWidth: 22, frameHeight: 24});
    this.load.spritesheet('cannon_selected', 'Content/cannon_select.png', {frameWidth: 24, frameHeight: 26});

    this.load.spritesheet('magi', 'Content/magi.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('magi_selected', 'Content/magi_select.png', {frameWidth: 10, frameHeight: 10});
    this.load.spritesheet('hound', 'Content/hound.png', {frameWidth: 8, frameHeight: 7});
    this.load.spritesheet('hound_selected', 'Content/hound_select.png', {frameWidth: 10, frameHeight: 9});
    this.load.spritesheet('dino', 'Content/dino.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('dino_selected', 'Content/dino_select.png', {frameWidth: 10, frameHeight: 10});
    this.load.spritesheet('cauldron', 'Content/cauldron.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('cauldron_selected', 'Content/cauldron_select.png', {frameWidth: 10, frameHeight: 10});

    this.load.spritesheet('corpse', 'Content/corpse.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('corpse_selected', 'Content/corpse_select.png', {frameWidth: 10, frameHeight: 10});
    
    this.load.spritesheet('hit', 'Content/hit.png', {frameWidth: 8, frameHeight: 8});

    this.load.image('menu_overlay', 'Content/menu_overlay.png');
}

var mainWorld;

function create()
{
    this.input.mouse.disableContextMenu();

    for(let i=0; i<4; i++)
        this.anims.create
        (
            {
                key:'waterline'+i.toString(),
                frames: this.anims.generateFrameNumbers('waterlines', {frames:[i]}),
                frameRate: 8,
                repeat:-1
            }
        );

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
    
    this.anims.create
    (
        {
            key:'cannon_idle',
            frames: this.anims.generateFrameNumbers('cannon', {frames:[0]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'cannon_selected_idle',
            frames: this.anims.generateFrameNumbers('cannon_selected', {frames:[0]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'explosion_anim',
            frames: this.anims.generateFrameNumbers('explosion', {frames:[0,1,2,3,4,5,6,7]}),
            frameRate: 8,
            repeat:0
        }
    );

    let unitNames=['magi', 'dino', 'cauldron', 'hound'];

    for(let i=0; i<unitNames.length; i++)
    {
        this.anims.create
        (
            {
                key:unitNames[i]+'_idle',
                frames: unitNames[i],
                frameRate: 8,
                repeat:-1
            }
        );
        this.anims.create
        (
            {
                key:unitNames[i]+'_selected_idle',
                frames: unitNames[i]+'_selected',
                frameRate: 8,
                repeat:-1
            }
        );
    }

    this.anims.create
    (
        {
            key:'mech_corpse_idle',
            frames: this.anims.generateFrameNumbers('corpse', {frames:[0]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'bio_corpse_idle',
            frames: this.anims.generateFrameNumbers('corpse', {frames:[1]}),
            frameRate: 8,
            repeat:-1
        }
    );

    this.anims.create
    (
        {
            key:'mech_corpse_selection',
            frames: this.anims.generateFrameNumbers('corpse_selected', {frames:[0]}),
            frameRate: 8,
            repeat:-1
        }
    );
    
    this.anims.create
    (
        {
            key:'bio_corpse_selection',
            frames: this.anims.generateFrameNumbers('corpse_selected', {frames:[1]}),
            frameRate: 8,
            repeat:-1
        }
    );

    this.anims.create
    (
        {
            key:'hit_anim',
            frames: 'hit',
            frameRate: 8,
            repeat:0
        }
    );

    mainWorld=new World(50, 33, this);
}

function update ()
{
    mainWorld.update();
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
