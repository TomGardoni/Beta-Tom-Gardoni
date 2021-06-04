class Platform extends Phaser.Scene{
    constructor(){
        super("Platform");
    }

        // FONCTION DE CHARGEMENT D'ASSETS --------------------------------------------------

    preload(){
        //Map
        this.load.image('Tiles', 'Tuiles.png');
        this.load.tilemapTiledJSON('Map', 'Map.json');
        

        //Background
        this.load.image('BG', 'assets/sky.png');
        this.load.image('para', 'assets/para.png');
        //Vie
        this.load.image('barre_de_vie_3hp', 'assets/hp3.png');
        this.load.image('barre_de_vie_2hp', 'assets/hp2.png');
        this.load.image('barre_de_vie_1hp', 'assets/hp1.png');
        this.load.image('barre_de_vie_0hp', 'assets/hp0.png');

        this.load.image('game_over', 'assets/game_overV2.png');

        //Personnage
        this.load.spritesheet('dude', 'assets/spritesheet_perso2.png', { frameWidth: 96, frameHeight: 119});

        this.load.image('Ghost1', 'assets/fantome1.png');
        this.load.image('Ghost2', 'assets/fantome2.png');

        //ITEMS
        this.load.image('Boisson', 'assets/Boisson.png');
        this.load.image('Cage', 'assets/cage.png');
        this.load.image('Gants', 'assets/gb.png');
        this.load.image('Ressort', 'assets/djump.png');
        this.load.image('key', 'assets/cle.png');


    } // FIN PRELOAD
    

    create(){
        this.recuper = 0;
        this.djump = false;
        this.box = false;
        this.jumpCount = 0;
        this.test = true;
        this.testB = true;
        this.immune = true;
        this.life = 3;
        this.HITTING = false;

        this.add.image(0, 0, 'BG').setOrigin(0).setDepth(-2);

        // CREATION DE LA MAP   
        let Map = this.make.tilemap({ key: 'Map' });
        let Tileset = Map.addTilesetImage('Tuiles', 'Tiles');

        this.sol = Map.createLayer('Calque 1', Tileset, 0, 0).setDepth(-1);
        this.para = this.add.image(2500,1700,'para').setScrollFactor(0.8,1).setDepth(-2);
        this.piques = Map.createLayer('Piques', Tileset, 0, 0).setDepth(0);
       

        // CREATION VARIABLE TOUCHES 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorSp = this.input.keyboard.addKey('SPACE');
        this.hp = this.add.image(1700,100,'barre_de_vie_3hp').setScrollFactor(0);


        // CREATION PLAYER
        const spawnPoint = Map.findObject("Objects", obj => obj.name === "Spawn Point");
		this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude').setDepth(0);
        this.player.setCollideWorldBounds(true);

        //CREATION ITEMS
        this.key = this.physics.add.staticGroup();

        this.physics.add.overlap(this.player, this.key, this.Recup, null,this);


        const Boisson1Sp = Map.findObject("Objects", obj => obj.name === "Boisson 1");
        const Boisson2Sp = Map.findObject("Objects", obj => obj.name === "Boisson 2");
        const Boisson3Sp = Map.findObject("Objects", obj => obj.name === "Boisson 3");
        const Boisson4Sp = Map.findObject("Objects", obj => obj.name === "Boisson 4");
        const Boisson5Sp = Map.findObject("Objects", obj => obj.name === "Boisson 5");
        
        this.boisson1 = this.physics.add.staticGroup();
        this.boisson2 = this.physics.add.staticGroup();
        this.boisson3 = this.physics.add.staticGroup();
        this.boisson4 = this.physics.add.staticGroup();
        this.boisson5 = this.physics.add.staticGroup();

        this.boisson1.create(Boisson1Sp.x, Boisson1Sp.y, 'Boisson').setDepth(0);
        this.boisson2.create(Boisson2Sp.x, Boisson2Sp.y, 'Boisson').setDepth(0);
        this.boisson3.create(Boisson3Sp.x, Boisson3Sp.y, 'Boisson').setDepth(0);
        this.boisson4.create(Boisson4Sp.x, Boisson4Sp.y, 'Boisson').setDepth(0);
        this.boisson5.create(Boisson5Sp.x, Boisson5Sp.y, 'Boisson').setDepth(0);

        this.physics.add.overlap(this.player,this.boisson1,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson2,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson3,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson4,this.recoltBois,null,this)
        this.physics.add.overlap(this.player,this.boisson5,this.recoltBois,null,this)

        const Djump = Map.findObject("Objects", obj => obj.name === "Double Saut");

        this.dsaut = this.physics.add.staticGroup();
        this.dsaut.create(Djump.x, Djump.y, 'Ressort').setDepth(0);
        this.physics.add.overlap(this.player,this.dsaut,this.deblocageSaut,null,this)

        const CageSp = Map.findObject("Objects", obj => obj.name === "Cage");

        this.cage = this.physics.add.staticGroup();
        this.untruc = this.cage.create(CageSp.x, CageSp.y, 'Cage').setDepth(1);
        this.physics.add.collider(this.player,this.cage)

        const BoxeSp = Map.findObject("Objects", obj => obj.name === "Gants de boxe");

        this.boxer = this.physics.add.staticGroup();
        this.boxer.create(BoxeSp.x, BoxeSp.y, 'Gants').setDepth(0);
        this.physics.add.overlap(this.player,this.boxer,this.Boxing,null,this)

        const FT1 = Map.findObject("Objects", obj => obj.name === "Fantome 1");
        const FT2 = Map.findObject("Objects", obj => obj.name === "Fantome 2");
        const FT3 = Map.findObject("Objects", obj => obj.name === "Fantome 3");
        const FT4 = Map.findObject("Objects", obj => obj.name === "Fantome 4");

        this.ghost1 = this.physics.add.group();
        this.ghost2 = this.physics.add.group();
        this.ghost3 = this.physics.add.group();
        this.ghost4 = this.physics.add.group();

        this.ghost1.create(FT1.x, FT1.y, 'Ghost1').setDepth(0);
        this.ghost2.create(FT2.x, FT2.y, 'Ghost2').setDepth(0);
        this.ghost3.create(FT3.x, FT3.y, 'Ghost1').setDepth(0);
        this.ghost4.create(FT4.x, FT4.y, 'Ghost2').setDepth(0);

        this.physics.add.overlap(this.player,this.ghost1,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost2,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost3,this.hit,null,this)
        this.physics.add.overlap(this.player,this.ghost4,this.hit,null,this)
		

        var test = this;

		this.ghost1.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-300,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
                flipX:true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost2.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost3.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        this.ghost4.children.iterate(function (child) {
			test.tweens.add({
				targets: child,
				x: child.x-200,
				duration: 3000,
				ease: 'Power2',
				yoyo: true,
				delay: 100,
				loop: -1
			});
		})
        
        // AJOUT COLLIDER ENTRE JOUEUR ET OBJETS DE LA MAP
        this.physics.add.collider(this.player, this.piques, this.death, null, this);
        this.piques.setCollisionByProperty({mortal:true});

        this.physics.add.collider(this.player, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost1, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost2, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost3, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        this.physics.add.collider(this.ghost4, this.sol);
        this.sol.setCollisionByProperty({collides:true});

        
        
        // AJOUT DES COLLIDERS 
        

        // AJOUT DE LA CONDITION DE CONNEXION D'UNE MANETTE 
        this.paddleConnected=false;

        this.input.gamepad.once('connected', function (pad) {
            this.paddleConnected = true;
            this.paddle = pad;
            });
        
        // CREATION ANIMATION JOUEUR
        
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
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dude', {start: 9, end: 12}),
            frameRate: 1,
        })

        this.anims.create({
            key: 'fight',
            frames: this.anims.generateFrameNumbers('dude', {start: 13, end: 14}),
            frameRate: 1,
        })
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);

        this.sol.renderDebug(debugGraphics, {
            tileColor: null, // couleur des tuiles snas collision
            collidingTileColor: new Phaser.Display.Color(134, 243, 0, 255), // couleur des tuiles en collision
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });

        this.piques.renderDebug(debugGraphics, {
            tileColor: null, // couleur des tuiles sans collision
            collidingTileColor: new Phaser.Display.Color(243, 134, 0, 255), // couleur des tuiles en collision
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
        */
        // AJOUT CAMERA 
        
        this.cameras.main.startFollow(this.player)
		this.cameras.main.setBounds(0,0,Map.widthInPixels, Map.heightInPixels);
        this.physics.world.setBounds(0,0, Map.widthInPixels, Map.heightInPixels);
		this.player.setCollideWorldBounds(true);
        this.para = this.add.image(2850,2000,'para').setScrollFactor(0.1);
    } // FIN CREATE  
    
    // FONCTION UPDATE --------------------------------------------------

    update(){
        const onGround = this.player.body.blocked.down;
        const speed = 400;
        
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
        this.add.image(640, 360, 'game_over').setScrollFactor(0);
    }
    }
        
     // FIN UPDATE
    
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
            if (this.immune){
                this.life -= 1;
                this.immune = false;
                
                if(this.life > 0){
                    this.effect = this.time.addEvent({ delay : 200, repeat: 9, callback: function(){player.visible = !player.visible;}, callbackScope: this});
                }

                this.ImmuneFrame = this.time.addEvent({ delay : 2000, callback: function(){this.immune = true}, callbackScope: this});

            }
            
            
            if(this.life == 0){
                this.player.setTint(0xff0000);
                this.physics.pause();
                this.gameOver = true;
            }
        }

    }

    Recup(player, key)
    {
        key.destroy();
        this.nbcle++
        if(this.nbcle == 4){
            //Porte peut spawn
        }
    }
    
    death(){
        this.player.setTint(0xff0000);
        this.physics.pause();
        this.gameOver = true;
    }
}
