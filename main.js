var config = 
{
    renderType: Phaser.WEBGL,
    width: 800,
    height: 600,
    antialias: false,
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('test', 'Content\\testimage.png');
    this.load.spritesheet('ground', 'Content\\ground.png', {frameWidth: 8, frameHeight: 8});
    this.load.spritesheet('water', 'Content\\water.png', {frameWidth: 8, frameHeight: 8});
}

function create ()
{
    new Ground(this, 0, 0, 100, 100);

    //this.add.image(100, 100, 'test').setDepth(0);
    
    //this.add.image(40, 100, 'test').setDepth(1);
}

function update ()
{

}