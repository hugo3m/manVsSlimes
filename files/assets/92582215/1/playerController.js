
/**
 * PlayerController handles all the logic for controlling the player
 */
var PlayerController = pc.createScript('playerController');

/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
PlayerController.prototype.initialize = function() {
    // Register and launch function attack on attack event
    this.app.on("playerController:Attack", this.attack, this);
    // Register and launch input left on input left event
    this.app.on("playerController:InputLeft", this.inputLeft, this);
    // Register and launch input right on input right event
    this.app.on("playerController:InputRight", this.inputRight, this);
    // Register and launch input up on input up event
    this.app.on("playerController:InputUp", this.inputUp, this);
    // Register and launch input down on input down event
    this.app.on("playerController:InputDown", this.inputDown, this);
    // When a contact occurs with the player rigidbody, launch contact function
    this.entity.rigidbody.on("contact", this.contact, this);
};

/**
 * Handle the logic on every update
 * @function update
 * @param {Int} dt Delta time
 * @return {null}
 */
PlayerController.prototype.update = function (dt) {
    // If one input is true in the characterModel
    if(this.entity.script.characterModel.input.down == true || this.entity.script.characterModel.input.up == true || this.entity.script.characterModel.input.left == true || this.entity.script.characterModel.input.right == true){
        // Retrieve X composant as positive or negative according to left or right
        const x = this.entity.script.characterModel.input.left && this.entity.script.characterModel.input.right ? 0 : (this.entity.script.characterModel.input.left ? 1 : (this.entity.script.characterModel.input.right ? -1 : 0));
        // Retrieve Z composant as positive or negative according to up or down
        const z = this.entity.script.characterModel.input.up && this.entity.script.characterModel.input.down ? 0 : (this.entity.script.characterModel.input.up ? 1 : (this.entity.script.characterModel.input.down ? -1 : 0));
        // If one of the composant is not 0
        if (x !== 0 || z !== 0) {
            // Create force to the rigidbody scale with the speed
            const force = new pc.Vec3(x, 0, z).normalize().scale(this.entity.script.characterModel.speed);
            // Apply the force
            this.entity.rigidbody.applyForce(force);
        }
    }
    
    // If the player is attacking
    if(this.entity.script.characterModel.action == "Attack"){
        // If the animation is finished
        if(this.isAnimationFinished(this.entity.sprite.currentClip.frame, this.entity.sprite.currentClip.sprite.frameKeys.length)){
            // Not attacking anymore
            this.entity.script.characterModel.isAttacking = false;
            // Disable sword
            this.entity.findByName("Sword_" + this.entity.script.characterModel.direction).enabled = false;
            // Play next animation
            this.entity.script.playerAnimationGraph.onEvent(this.entity);
        }
    }

    // If the player dies
    if(this.entity.script.characterModel.action == "Die"){
        // If animation is finished
        if(this.isAnimationFinished(this.entity.sprite.currentClip.frame, this.entity.sprite.currentClip.sprite.frameKeys.length)){
            // Make the player die
            this.die();
        }
    }
};

/**
 * Make the player attacks
 * @function attack
 * @return {null}
 */
PlayerController.prototype.attack = function(){
    // Player is attacking
    this.entity.script.characterModel.isAttacking = true;
    // Enable the sword
    this.entity.findByName("Sword_" + this.entity.script.characterModel.direction).enabled = true;
    // Play the next animation
    this.entity.script.playerAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on left input
 * @function inputLeft
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
PlayerController.prototype.inputLeft = function(event){
    // Set the input of the model
    this.entity.script.characterModel.input.left = event;
    // Play next animation
    this.entity.script.playerAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on right input
 * @function inputRight
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
PlayerController.prototype.inputRight = function(event){
    // Set the input of the model
    this.entity.script.characterModel.input.right = event;
    // Play animation
    this.entity.script.playerAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on up input
 * @function inputUp
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
PlayerController.prototype.inputUp = function(event){
    // Set the input of the model
    this.entity.script.characterModel.input.up = event;
    // Play next animation
    this.entity.script.playerAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on down input
 * @function inputDown
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
PlayerController.prototype.inputDown = function(event){
    // Set the input of the model
    this.entity.script.characterModel.input.down = event;
    // Play next animation
    this.entity.script.playerAnimationGraph.onEvent(this.entity);
};

/**
 * Return if the animation is finished or not
 * @function isAnimationFinished
 * @param {Int} frame current frame
 * @param {Int} numberFrames total number of frames
 * @return {Boolean} true if animation is finished, false otherwise
 */
PlayerController.prototype.isAnimationFinished = function(frame, numberFrames){ 
    return frame == numberFrames - 1;
};

/**
 * Logic when a contact occurs
 * @function contact
 * @param {Entity} result entity with who the contacts happened
 * @return {null}
 */
PlayerController.prototype.contact = function(result){
    // If the entity is a character and player is not already under attack and is not attacking
    if (result.other.script.rigidbodyLayers.characters && this.entity.script.characterModel.isAttacked == false && this.entity.script.characterModel.isAttacking == false){
        // Decrease health
        this.entity.script.characterModel.health = this.entity.script.characterModel.health > 0 ? this.entity.script.characterModel.health - 1 : 0;
        // Update the display
        this.app.fire('application:UpdateHealth');
        // If health is 0, play next animation
        if(this.entity.script.characterModel.health == 0) this.entity.script.playerAnimationGraph.onEvent(this.entity);
        // Player now under attack
        this.entity.script.characterModel.isAttacked = true;
        // Change player color
        this.entity.sprite.color = new pc.Color(1, 0, 0);
        const hurting = function(entity) {
            entity.sprite.color = new pc.Color(1, 1, 1);
            entity.script.characterModel.isAttacked = false;
        };
        // After 1.5 second, set color back and isAttacked to false
        setTimeout(hurting, 1500, this.entity);    
    } 
};

/**
 * Handle the logic when the player is dead
 * @function die
 * @return {null}
 */
PlayerController.prototype.die = function(){
    // Remove mask to make him unmove
    this.entity.script.rigidbodyLayers.maskCharacters = false;
    // Update mask
    this.entity.script.rigidbodyLayers.setRigidbodyGroupMask();
    // Remove inputs
    this.entity.script.characterModel.input.left = false;
    this.entity.script.characterModel.input.right = false;
    this.entity.script.characterModel.input.up = false;
    this.entity.script.characterModel.input.down = false;
    // Stop the game
    this.app.fire("application:Stop");
};
