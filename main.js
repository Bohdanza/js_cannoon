var config = 
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
}

function create ()
{
    this.add.image(100, 100, 'test').setDepth(0);
    
    this.add.image(40, 100, 'test').setDepth(1);
}

function update ()
{
}