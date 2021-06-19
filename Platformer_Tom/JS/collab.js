class collab extends Phaser.Scene {
    constructor() {
        super('collab')
    }
    preload()
	{
        this.load.image('colabomenu', '/assets/colabomenu.png')
        this.load.image('back', './assets/back.png')
        
        
	}
    
    create() { 

        //create images (z order)
        this.blabla = true;
   
        this.add.image(0, 0, 'colabomenu').setOrigin(0).setDepth(0);

        
        let back = this.add.image(this.game.renderer.width /10, this.game.renderer.height /14, 'back').setDepth(1);


       
        back.setInteractive();

        back.on("pointerup", () => {
            this.sound.play('pop');
            this.scene.start('optionsm');
            
        })


    }
}
