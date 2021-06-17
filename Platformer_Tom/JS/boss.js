class Boss extends Phaser.Scene {
    constructor() {
        super('boss')
    }

    
    preload(){
        
        //Map
        this.load.image('salleboss', 'murenfers.png');
        this.load.tilemapTiledJSON('map_boss', 'boss.json');
        
        //Background
        this.load.image('salle', 'assets/salleboss.png');
        
        //ITEMS
        this.load.image('fleche', 'assets/fleche.png');
        
        //Vie
                
        this.load.image('barre_de_vie_3hp', 'assets/hp3.png');
        this.load.image('barre_de_vie_2hp', 'assets/hp2.png');
        this.load.image('barre_de_vie_1hp', 'assets/hp1.png');
        this.load.image('barre_de_vie_0hp', 'assets/hp0.png');
        
        this.load.image('game_over', 'assets/End.png');
        
        //Personnage
        this.load.spritesheet('dude', 'assets/spritesheet_perso2.png', { frameWidth: 96, frameHeight: 119});
        this.load.spritesheet('boss', 'assets/boss.png', { frameWidth: 1000, frameHeight: 900});

    }
    // FIN PRELOAD
    
    
    create(){
       
        this.nbcle = 0;
        this.droite = false;
        this.recuper = 0;
        this.djump = true;
        this.box = true;
        this.jumpCount = 0;
        this.test = true;
        this.testB = true;
        this.immune = true;
        this.life = 3;
        this.HITTING = false;
        this.isDead = false;
        this.dash = true;            // Si le joueur possède le dash.
        this.timerDashOn = false;    // Lance le timer du dash.
        this.timerDash = 0;          // Timer du dash.
        this.directionDash = false;          // Donne la direction vers laquelle le dash doit être fait.
        this.lessgo = true;
        this.unlocked = false;
        
        this.add.image(0, 50, 'salle').setOrigin(0).setDepth(-2);

        // CREATION DE LA MAP 
        let Map = this.make.tilemap({ key: 'map_boss' });
        let Tileset = Map.addTilesetImage('salleboss', 'salleboss');

        this.sol = Map.createLayer('ground', Tileset, 0, 0).setDepth(-1);
        // CREATION BOSS
        this.boss = this.physics.add.sprite(960, 540, 'boss').setDepth(0);
        this.boss.setCollideWorldBounds(true);
        
       // CREATION PLAYER
		this.player = this.physics.add.sprite(200, 950, 'dude').setDepth(0);
        this.player.setCollideWorldBounds(true);


        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorSp = this.input.keyboard.addKey('SPACE');
        this.cursorDash = this.input.keyboard.addKey('A');
        this.hp = this.add.image(1700,100,'barre_de_vie_3hp').setScrollFactor(0);

        this.flecheBack = this.add.image(1840, 250, 'fleche').setScrollFactor(0).setDepth(3);
        this.flecheBack.setTintFill(0x000000);
        this.fleche = this.add.image(this.flecheBack.x, this.flecheBack.y, 'fleche').setScrollFactor(0).setDepth(3);

        // AJOUT COLLIDER ENTRE JOUEUR ET OBJETS DE LA MAP


        this.physics.add.collider(this.boss, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.player, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        //this.physics.add.collider(this.fleche, this.sol);
        this.sol.setCollisionByProperty({collides:true});




        // AJOUT DE LA CONDITION DE CONNEXION D'UNE MANETTE 
        this.paddleConnected=false;

        this.input.gamepad.once('connected', function (pad) {
            this.paddleConnected = true;
            this.paddle = pad;
            });
        
        // CREATION ANIMATION JOUEUR
       
        this.anims.create({
            key: 'dash',
            frames: [{key : 'dude', frame : 25}],
            frameRate : 10
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
            frameRate: 10,
        });

       
        this.anims.create({
            key: 'face',
            frames: this.anims.generateFrameNumbers('dude', {start: 15, end: 20}),
            frameRate: 9,
        })
       
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('dude', {start: 21, end: 25}),
            frameRate: 5,
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dude', {start: 9, end: 12}),
            frameRate: 1,
        })

        this.anims.create({
            key: 'fight',
            frames: this.anims.generateFrameNumbers('dude', {start: 13, end: 14}),
            frameRate: 1,
        })



        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('boss', {start: 0, end: 4}),
            frameRate: 4,
        })

    }

        update(){
        // Update the animation
        const onGround = this.player.body.blocked.down;
        const speed = 400;
        
        // console.log(this.directionDash)

        
        // ANIME boss

        if(combat==true){
            this.boss.anims.play('move',true);
        }
        // CONTROLES CLAVIER ET MANETTE

        if (this.player.body.velocity.y > 950){
            this.player.setVelocityY(950);
        }
        
        let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
        }
        
        if (this.cursors.left.isDown ) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown ) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
      
       // Dash --------------------

        if (this.cursors.left.isDown) {     
            this.directionDash = true
        }

        if (this.cursors.right.isDown) {     
            this.directionDash = false
        }

        if(this.timerFleche > 0){
            this.timerFleche--;
            if(this.cropValue > this.flecheBack.height || this.cropValue < this.flecheBack.height){this.cropValue = this.flecheBack.height;}
            else{this.cropValue = this.timerFleche;}
            // crée un sorte de jauge pour montrer au joueur si iel peux utiliser le dash ou non
            if(this.timerFleche%2 != 0){this.fleche.setCrop(0, this.cropValue, this.flecheBack.width, this.flecheBack.height);}
        } else if(this.timerFleche <= 0 && this.timerFleche > -1){
            console.log("ha")
            this.timerFleche = this.timerFleche -0.1;
            this.fleche.setTintFill(0xffffff);
        } else{
            this.fleche.clearTint();
            this.fleche.setCrop(0, 0, this.flecheBack.width, this.flecheBack.height);
            console.log("elese")
        }

        if (this.dash && Phaser.Input.Keyboard.JustDown(this.cursorDash)){
            console.log(this.timerFleche)
            this.timerDashOn = true;
            this.dash = false;
            this.timerFleche = this.flecheBack.height-1;
            this.dashTime = this.time.addEvent({ delay: 2600, callback: function(){this.dash = true;}, callbackScope: this});
            console.log ('DASH!!!!!!' + this.directionDash, this.dash);
        }


        if (this.timerDashOn){

            this.timerDash += 1

            if (this.directionDash){
                this.player.setVelocityX(-1000);
            }
            else{
                this.player.setVelocityX(1000);
            }
            

            if (this.timerDash >= 20){
                this.timerDashOn = false
                this.timerDash = 0
            }
        }

        // Allow player to jump only if on ground
        if (onGround && this.cursors.up.isDown && !this.djump){
            this.player.setVelocityY(-1200);
        }
          
        if ((this.player.body.touching.down || this.jumpCount < 2) && (this.cursors.up.isDown) && this.test && this.djump) {
            this.player.setVelocityY(-1200);
            
            this.test = false;
            this.jumpCount++;

            console.log(this.jumpCount)
        }

        if (this.cursors.up.isUp){
            this.test = true ; 
        }

        if (this.cursorSp.isDown && this.box && this.testB){
            this.testB = false;
            this.boxe = this.time.addEvent({ delay : 200, repeat: 9, callback: function(){this.HITTING = true;}, callbackScope: this});
        }

        if (this.cursorSp.isUp){
            this.testB = true ; 
        }

        if ( this.physics.world.overlap(this.player, this.door) && this.unlocked){
            this.scene.start('boss')
        }
          

           // Update the animation
        if (onGround) {
            
            this.jumpCount = 1
            
            //Player Running if velocityX != 0 else Player Idle
        if (this.cursorSp.isDown && this.box)this.player.anims.play("fight", true);
        else if (this.player.body.velocity.x !== 0) this.player.anims.play("run", true);
        else this.player.anims.play("face", true);
        } else {
            //Stopping Animation to play a Texture for the jump
            this.player.anims.play("jump", true);
          }
    
      
        // UPDATE DE LA VIE AVEC CHANGEMENT VISIBLE DE CETTE DERNIERE
   
        if (this.life == 3){
        this.hp.setTexture("barre_de_vie_3hp");
            
        }
        else if (this.life == 2){
            this.hp.setTexture("barre_de_vie_2hp" );
            
        }
        
        else if (this.life == 1){
            this.hp.setTexture("barre_de_vie_1hp");
        
        }
        
        else if (this.life == 0){
            this.hp.setTexture("barre_de_vie_0hp");
            
        }
        
    }

   
    // AUTRES FONCTIONS 
    deblocageSaut(player,saut){
        saut.destroy();
        this.djump = true;
    }

    Boxing(player,boxe){
        boxe.destroy();
        this.box = true;
    }

    recoltBois(player,boisson){
        boisson.destroy();
        this.recuper += 1;
        if (this.recuper == 5){
            this.untruc.destroy();
            this.recuper = 0;
        }
    }
    hit(player,ennemy){
        if (this.HITTING){
            ennemy.destroy();
            var key = this.key.create(ennemy.x,ennemy.y,'key')
        }
        else{

            if (!this.timerDashOn){
                if (this.immune){
                    this.life -= 1;
                    this.immune = false;
                    
                    if(this.life > 0){
                        this.effect = this.time.addEvent({ delay : 200, repeat: 9, callback: function(){player.visible = !player.visible;}, callbackScope: this});
                    }
    
                    this.ImmuneFrame = this.time.addEvent({ delay : 2000, callback: function(){this.immune = true}, callbackScope: this});
    
                }
            }
            
            
            
            if(this.life == 0){
                this.isDead = true
                this.player.anims.play("die", true);
                this.physics.pause();
                const cam = this.cameras.main;
                cam.fadeOut(1000);
        

                cam.once("camerafadeoutcomplete", ()=> {
                    cam.fadeIn(3000)
                    this.add.image(960, 540, 'game_over').setScrollFactor(0).setDepth(5);
                    this.gameOver = true;
            })
            }
        }

    }


    death(){
        this.isDead = true
        this.player.anims.play("die", true);
        this.physics.pause();
        const cam = this.cameras.main;
        cam.fadeOut(1000);
        

        cam.once("camerafadeoutcomplete", ()=> {

            cam.fadeIn(3000)
            this.add.image(960, 540, 'game_over').setScrollFactor(0).setDepth(5);
            this.gameOver = true;
        })
        
        
    }
}