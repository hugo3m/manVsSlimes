/**
 * Application handle the logic of the scene and the game logic
 */
var Application = pc.createScript('application');
// Register to the events
pc.events.attach(this);

// Entity used to spawn new slimes
Application.attributes.add('slimeFactory', {type: 'entity', title: "Slime Factory"});
// Player entity
Application.attributes.add('player', {type: 'entity', title: "Player"});
// Entity for spawning slimes on the left of the map
Application.attributes.add('spawnLeft', {type: 'entity', title: "Spawn left"});
// Entity as first destination to lead left spawned slime inside the map
Application.attributes.add('destinationLeft', {type: 'entity', title: "Destination left"});
// Entity for spawning slimes on the right of the map
Application.attributes.add('spawnRight', {type: 'entity', title: "Spawn right"});
// Entity as first destination to lead right spawned slime inside the map
Application.attributes.add('destinationRight', {type: 'entity', title: "Destination right"});
// Entity for spawning slimes at the top of the map
Application.attributes.add('spawnTop', {type: 'entity', title: "Spawn top"});
// Entity as first destination to lead top spawned slime inside the map
Application.attributes.add('destinationTop', {type: 'entity', title: "Destination top"});

/**
 * Initialize the application
 * @function initialize
 * @return {null}
 */
Application.prototype.initialize = function(){
    // Register to application:Start trigerring start function
    this.app.on("application:Start", this.start, this);
    // Register to application:Reload event trigerring reload function
    this.app.on("application:Reload", this.reload, this);
    // Register to application:Stop event trigerring stop function
    this.app.on("application:Stop", this.stop, this);
};


/**
 * Reload the tab
 * @function reload
 * @return {null}
 */
Application.prototype.reload = function(){
    location.reload();
};

/**
 * Fire events according to the key pressed from user's keyboard
 * @param {Event} event Event of the key pressed 
 * @function onKeyDown
 * @return {null}
 */
Application.prototype.onKeyDown = function(event){
    // Space key fire Attack from playerController
    if (event.key == pc.KEY_SPACE) this.app.fire('playerController:Attack');
    // // W key fire InputUp from playerController with key is down to true
    // if (event.key == pc.KEY_W) this.app.fire('playerController:InputUp', true);
    // Up key fire InputUp from playerController with key is down to true
    if (event.key == pc.KEY_UP) this.app.fire('playerController:InputUp', true);
    // // S key fire InputDown from playerController with key is down to true
    // if (event.key == pc.KEY_S) this.app.fire('playerController:InputDown', true);
    // Down key fire InputDown from playerController with key is down to true
    if (event.key == pc.KEY_DOWN) this.app.fire('playerController:InputDown', true);
    // // A key fire InputLeft from playerController with key is down to true
    // if (event.key == pc.KEY_A) this.app.fire('playerController:InputLeft', true);
    // Left key fire InputLeft from playerController with key is down to true
    if (event.key == pc.KEY_LEFT) this.app.fire('playerController:InputLeft', true);
    // // D key fire InputRight from playerController with key is down to true
    // if (event.key == pc.KEY_D) this.app.fire('playerController:InputRight', true);
    // Right key fire InputRight from playerController with key is down to true
    if (event.key == pc.KEY_RIGHT) this.app.fire('playerController:InputRight', true);
};


/**
 * Fire events according to the key released from user's keyboard
 * @param {Event} event Event of the key released
 * @function onKeyUp
 * @return {null}
 */
Application.prototype.onKeyUp = function(event){
    // // W key fire InputUp from playerController with key is down to false
    /// if (event.key == pc.KEY_W) this.app.fire('playerController:InputUp', false);
    // Up key fire InputUp from playerController with key is down to false
    if (event.key == pc.KEY_UP) this.app.fire('playerController:InputUp', false);
    // // S key fire InputDown from playerController with key is down to false
    // if (event.key == pc.KEY_S) this.app.fire('playerController:InputDown', false);
    // Down key fire InputDown from playerController with key is down to false
    if (event.key == pc.KEY_DOWN) this.app.fire('playerController:InputDown', false);
    // // A key fire InputLeft from playerController with key is down to false
    // if (event.key == pc.KEY_A) this.app.fire('playerController:InputLeft', false);
    // Left key fire InputLeft from playerController with key is down to false
    if (event.key == pc.KEY_LEFT) this.app.fire('playerController:InputLeft', false);
    // // D key fire InputRight from playerController with key is down to false
    // if (event.key == pc.KEY_D) this.app.fire('playerController:InputRight', false);
    // Right key fire InputRight from playerController with key is down to false
    if (event.key == pc.KEY_RIGHT) this.app.fire('playerController:InputRight', false);
};


/**
 * Update the health displayed by the application according to the player health value
 * @function updateHealthDisplay
 * @return {null}
 */
Application.prototype.updateHealthDisplay = function(){
    // Retrieve the health of the player
    const health = this.player.script.characterModel.health;
    // Find the corresponding picture
    var textureAsset = this.app.assets.find("health-" + health.toString() +".png");
    // Display it
    this.entity.findByName("Health").element.textureAsset = textureAsset;
};


/**
 * Start the game
 * @function start
 * @return {null}
 */
Application.prototype.start = function(){
    // Hide start button
    this.entity.findByName("Start").enabled = false;
    // Display inputs
    // this.entity.findByName("A").enabled = true;
    // this.entity.findByName("D").enabled = true;
    // this.entity.findByName("W").enabled = true;
    // this.entity.findByName("S").enabled = true;
    this.entity.findByName("Arrow_up").enabled = true;
    this.entity.findByName("Arrow_right").enabled = true;
    this.entity.findByName("Arrow_left").enabled = true;
    this.entity.findByName("Arrow_down").enabled = true;
    this.entity.findByName("Space").enabled = true;
    // Display player's health
    this.entity.findByName("Health").enabled = true;
    // Register to user keyboard events
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
    // Register to application:UpdateHealth
    this.app.on("application:UpdateHealth", this.updateHealthDisplay, this);
    // Register to application:SlimeDied
    this.app.on("application:SlimeDied", this.slimeDied, this);
    // Set currentWave to 0
    this.currentWave = 0;
    // Set currentSlimes to 0
    this.currentSlimes = 0;
    // Launch a new wave
    this.newWave();
};

/**
 * Stop the game
 * @function stop
 * @return {null}
 */
Application.prototype.stop = function(){
    // Unregister to user keyboard event
    this.app.keyboard.off(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.off(pc.EVENT_KEYUP, this.onKeyUp, this);
    // Unregister to update health of the player
    this.app.off("application:UpdateHealth", this.updateHealthDisplay, this);
    // Unregister to slimes dying
    this.app.off("application:SlimeDied", this.slimeDied, this);
    // After four seconds
    setTimeout(
        function(playAgain){
            // Display play again button which reload the tab on click
            playAgain.enabled = true;
        },
    4000, this.entity.findByName("PlayAgain"));
};

/**
 * Logic a new wave incoming in the game
 * @function newWave
 * @return {null}
 */
Application.prototype.newWave = function(){
    // Put back player's health tp maximum
    this.player.script.characterModel.health = 4;
    // Update health display
    this.updateHealthDisplay();
    // Increase the wave index
    this.currentWave += 1;
    // Retrieve the number of slimes to spawn
    const slimeToSpawn = this.currentWave * 3;
    // The number of current slimes is the number to spawn
    this.currentSlimes = slimeToSpawn;
    // Function to spawn the slime
    const spawnSlime = function(i, slimeToSpawn, application) {
        // If first iteration
        if(i == 0){
            // Display warning new wave to the player
            application.entity.findByName("NewWave").enabled = true;
            // After 3 seconds
            setTimeout(
                function(newWave, i, slimeToSpawn, application){
                    // Hide the warning
                    newWave.enabled = false;
                    // Launch the function with increased index
                    setTimeout(spawnSlime, 2000, i + 1, slimeToSpawn, application);
                }, 
            3000, application.entity.findByName("NewWave"), i, slimeToSpawn, application);
        }
        // If iteration less or equal than slimesToSpawn
        else if(i <= slimeToSpawn){
            // Get available spots
            const spot = ["Left", "Top", "Right"];
            // Clone the slime
            var slime = application.slimeFactory.clone();
            application.entity.parent.addChild(slime);
            // Set its position according to the spot
            slime.setPosition(application["spawn" + spot[i % 3]].getPosition());
            // Set its destination according to its position
            slime.script.slimeAi.destination = new pc.Vec2(application["destination" + spot[i % 3]].getPosition().x, application["destination" + spot[i % 3]].getPosition().z);
            // Enable the slime
            slime.enabled = true;
            // Launch the function with increased index
            setTimeout(spawnSlime, 2000, i + 1, slimeToSpawn, application);
        }
        
    };
    // After 0.5 second (5 for first wave) launch first iteration of the function
    setTimeout(spawnSlime, this.currentWave == 1? 5000:500, 0, slimeToSpawn, this); 
};

/**
 * When a slime dies decrease number of slime, if they are all dead launch new wave
 * @function slimeDied
 * @return {null}
 */
Application.prototype.slimeDied = function(){
    this.currentSlimes -= 1;
    if(this.currentSlimes == 0) this.newWave();
};