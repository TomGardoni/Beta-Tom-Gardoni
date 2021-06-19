class optionsm extends Phaser.Scene {
    constructor() {
        super('optionsm')
    }
    preload()
	{
        this.load.image('optionm', './assets/optionmenu.png')
        this.load.image('controls', './assets/controls.png')
        this.load.image('collab', './assets/credits.png')
        this.load.image('back', './assets/back.png')
        
        
	}
    
    create() { 

        //create images (z order)
        this.blabla = true;
   
        this.add.image(0, 0, 'optionm').setOrigin(0).setDepth(0);

        let controls = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'controls').setDepth(1);
        let options = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.5, 'collab').setDepth(1);
        let back = this.add.image(this.game.renderer.width / 10, this.game.renderer.height / 14, 'back').setDepth(1);


        controls.setInteractive();

    
            
        controls.on("pointerup", () => {
            this.sound.play('pop');
            this.scene.start('controls');
                
        })         
            

        options.setInteractive();

        options.on("pointerup", () => {
            this.sound.play('pop');
            this.scene.start('collab');
            
        })
        
        back.setInteractive();

        back.on("pointerup", () => {
            this.sound.play('pop');
            this.scene.start('menu');
            
        })


    }
}
