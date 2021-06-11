class Menu extends Phaser.Scene {
    constructor() {
        super('menu')
    }

    preload()
	{
		
        this.load.image('playbutton', './assets/adventure.png')
        this.load.image('menu', './assets/menu.png')
        this.load.image('options', './assets/options.png')
        this.load.image('exit', './assets/exit.png')
	}

    create() { //creating the menu screen

        //create images (z order)

        this.add.image(0, 0, 'menu').setOrigin(0).setDepth(0);

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.6, 'playbutton').setDepth(1);
        let options = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.3, 'options').setDepth(1);
        let exit = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 1.1, 'exit').setDepth(1);

        //let commandButton = this.add.image(this.game.renderer.width -100 , this.game.renderer.height * 0.10, 'commandesbutton').setDepth(1).setScale(0.7);

        


        /* 
            PointerEvents:
                pointerover - hovering
                pointerout - not hovering
                pointerup - click and release
                pointerdown - just click
        */

        playButton.setInteractive();

        playButton.on("pointerup", () => {
            this.scene.start('Platform');
        })

        options.setInteractive();

        options.on("pointerup", () => {
            this.scene.start('Platform');
        })
        
        exit.setInteractive();

        exit.on("pointerup", () => {
            this.scene.start('Platform');
        })

        //commandButton.setInteractive();

        //commandButton.on("pointerup", () => {
            //UNTRUC
            
        //})

    }
}