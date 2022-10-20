/**
 * SlimeController handles all the logic to control the slime
 */
var SlimeController = pc.createScript('slimeController');

/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
SlimeController.prototype.initialize = function() {
    // When a contact, call contact function
    this.entity.rigidbody.on("contact", this.contact, this);
};

SlimeController.prototype.update = function (dt) {
    // If the slime is not under attack
    if(!this.entity.script.characterModel.isAttacked){
        // If there is any input
        if(this.entity.script.characterModel.input.down == true || this.entity.script.characterModel.input.up == true || this.entity.script.characterModel.input.left == true || this.entity.script.characterModel.input.right == true){
            // Retrieve X value, positive for going left and negative for going right
            const x = this.entity.script.characterModel.input.left && this.entity.script.characterModel.input.right ? 0 : (this.entity.script.characterModel.input.left ? 1 : (this.entity.script.characterModel.input.right ? -1 : 0));
            // Retrieve Z value, positive for going up and negative for going down
            const z = this.entity.script.characterModel.input.up && this.entity.script.characterModel.input.down ? 0 : (this.entity.script.characterModel.input.up ? 1 : (this.entity.script.characterModel.input.down ? -1 : 0));
            // If one is not 0
            if (x !== 0 || z !== 0) {
                // Create force to apply scale with the speed
                const force = new pc.Vec3(x, 0, z).normalize().scale(this.entity.script.characterModel.speed);
                // Apply the force
                this.entity.rigidbody.applyForce(force);
            }
        }
    }
    // If the slime is hit
    if(this.entity.script.characterModel.action === "Hit"){
        // When the animation is finished
        if(this.isAnimationFinished(this.entity.sprite.currentClip.frame, this.entity.sprite.currentClip.sprite.frameKeys.length)){
            // Slime is no longer under attack
            this.entity.script.characterModel.isAttacked = false;
            // Play next animation
            this.entity.script.slimeAnimationGraph.onEvent(this.entity);
        }
    }
    // If the slime is dying
    if(this.entity.script.characterModel.action === "Die"){
        // If the animation is finished
        if(this.isAnimationFinished(this.entity.sprite.currentClip.frame, this.entity.sprite.currentClip.sprite.frameKeys.length)){
            // Make it die
            this.die();
        }
    }
};

/**
 * Set the model and play animation on left input
 * @function inputLeft
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
SlimeController.prototype.inputLeft = function(event){
    // Set the input left value
    this.entity.script.characterModel.input.left = event;
    // Play next animation
    this.entity.script.slimeAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on right input
 * @function inputRight
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
SlimeController.prototype.inputRight = function(event){
    // Set the input right value
    this.entity.script.characterModel.input.right = event;
    // Play next animation
    this.entity.script.slimeAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on up input
 * @function inputUp
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
SlimeController.prototype.inputUp = function(event){
    this.entity.script.characterModel.input.up = event;
    this.entity.script.slimeAnimationGraph.onEvent(this.entity);
};

/**
 * Set the model and play animation on down input
 * @function inputDown
 * @param {Boolean} event true if key pressed, false if released
 * @return {null}
 */
SlimeController.prototype.inputDown = function(event){
    // Set the input down value
    this.entity.script.characterModel.input.down = event;
    // Play next animation
    this.entity.script.slimeAnimationGraph.onEvent(this.entity);
};

/**
 * Return if the animation is finished or not
 * @function isAnimationFinished
 * @param {Int} frame current frame
 * @param {Int} numberFrames total number of frames
 * @return {Boolean} true if animation is finished, false otherwise
 */
SlimeController.prototype.isAnimationFinished = function(frame, numberFrames){
    return frame == numberFrames - 1;
};

/**
 * Handle the logic when contact occurs with slime
 * @function contact
 * @param {Entity} result Entity with which the contact occured
 * @return {null} 
 */
SlimeController.prototype.contact = function(result) {
    // If the contact occurs with a weapon and the slime is not already under attack
    if (result.other.script.rigidbodyLayers.weapons && !this.entity.script.characterModel.isAttacked){
        // Slime is now under attack
        this.entity.script.characterModel.isAttacked = true;
        // Decrease health
        this.entity.script.characterModel.health = this.entity.script.characterModel.health > 0 ? this.entity.script.characterModel.health - 1 : 0;
        // Play next animation
        this.entity.script.slimeAnimationGraph.onEvent(this.entity);
    }
    // If the contact occurs with environment or other characters
    if(result.other.script.rigidbodyLayers.environment || result.other.script.rigidbodyLayers.characters){
        // Send it to random destination
        this.entity.script.slimeAi.setRandomDestination();
    }
};

/**
 * Handle the logic when the slime dies
 * @function die
 * @return {null} 
 */
SlimeController.prototype.die = function() {
    // Destroy the entity
    this.entity.destroy();
    // Notify the application
    this.app.fire("application:SlimeDied");
};
