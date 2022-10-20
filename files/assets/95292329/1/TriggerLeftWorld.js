/**
 * TriggerLEftWorld kills characters leaving the world
 */
var TriggerLeftWorld = pc.createScript('triggerLeftWorld');


/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
TriggerLeftWorld.prototype.initialize = function() {
    // Launch OnTriggerLeave when a rigidbody leaves the collision component
    this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
};

/**
 * Behaviour when a rigidbody leaves the collision
 * @function onTriggerLeave
 * @param  {entity} result Entity which left the collision
 * @return {null}
 */
TriggerLeftWorld.prototype.onTriggerLeave = function(result) {
    // If the rigidbody is a charatcer
    if(result.script.rigidbodyLayers.characters){
        // Call die for an ennemy
        if(result.tags.has('Ennemy')) result.script.slimeController.die();
        // Call die for the player
        if(result.tags.has('Player')) result.script.playerController.die();
    }
};