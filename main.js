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
    grn=this.load.spritesheet('water', 'Content/water.png', {frameWidth: 8, frameHeight: 8});
}

function create ()
{
    this.anims.create
    (
        {
            key:'ground',
            frames: this.anims.generateFrameNumbers('ground', {frames:[0]}),
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

    new Ground(this, 0, 0, 100, 100);

    //this.add.image(100, 100, 'test').setDepth(0);
    
    //this.add.image(40, 100, 'test').setDepth(1);
}

function update ()
{

}

var game = new Phaser.Game(config);
