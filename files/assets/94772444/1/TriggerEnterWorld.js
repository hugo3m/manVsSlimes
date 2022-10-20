/**
 * TriggerEnterWorld set the colliding entity as a character when
 * it leaves the collision component
 */
var TriggerEnterWorld = pc.createScript('triggerEnterWorld');


/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
TriggerEnterWorld.prototype.initialize = function() {
    // Launch OnTriggerLeave when a rigidbody leaves the collision component
    this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
};

/**
 * Behaviour when a rigidbody leaves the collision
 * @function onTriggerLeave
 * @param  {entity} result Entity which left the collision
 * @return {null}
 */
TriggerEnterWorld.prototype.onTriggerLeave = function(result) {
    // If the rigidbody is not part of any group
    if(!result.script.rigidbodyLayers.characters && !result.script.rigidbodyLayers.weapons && !result.script.rigidbodyLayers.environment){
        // The colliding entity is now colliding as a character
        result.script.rigidbodyLayers.characters = true;
        // Update the rigidbody group and mask
        result.script.rigidbodyLayers.setRigidbodyGroupMask();
    }
    
};