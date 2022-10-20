/**
 * RigidbodyLayers defines the group and mask of the rigidbody's entity
 */
var RigidbodyLayers = pc.createScript('rigidbodyLayers');

// Is rigidbody's entity in group environment
RigidbodyLayers.attributes.add('environment', {type: 'boolean', default: false, title: 'Group environment'});
// Is rigidbody's entity in group characters
RigidbodyLayers.attributes.add('characters', {type: 'boolean', default: false, title: 'Group characters'});
// Is rigidbody's entity in group weapons
RigidbodyLayers.attributes.add('weapons', {type: 'boolean', default: false, title: 'Group weapons'});
// Does rigidbody's entity mask all
RigidbodyLayers.attributes.add('maskAll', {type: 'boolean', default: true, title: 'Mask All'});
// Does rigidbody's entity mask environment
RigidbodyLayers.attributes.add('maskEnvironment', {type: 'boolean', default: false, title: 'Mask environment'});
// Does rigidbody's entity mask characters
RigidbodyLayers.attributes.add('maskCharacters', {type: 'boolean', default: false, title: 'Mask characters'});
// Does rigidbody's entity mask weapons
RigidbodyLayers.attributes.add('maskWeapons', {type: 'boolean', default: false, title: 'Mask weapons'});

/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
RigidbodyLayers.prototype.initialize = function() {
    // Set group and mask rigidbody on initialize
    this.setRigidbodyGroupMask();
};


/**
 * Set rigidbody group and mask according to RigidbodyLayers attributes
 * @function setRigidbodyGroupMask
 * @return {null}
 */
RigidbodyLayers.prototype.setRigidbodyGroupMask = function() {
    // Retrieve entity's rigidbody
    var body = this.entity.rigidbody;
    
    // Define the group according to RigidbodyLayers attributes
    if (this.environment) {
        body.group |= (pc.BODYGROUP_USER_1);
    }

    if (this.characters) {
        body.group |= (pc.BODYGROUP_USER_2);
    }

    if (this.weapons) {
        body.group |= (pc.BODYGROUP_USER_3);
    }
    
    // Reset the mask to 0 so that the engine defaults aren't used
    body.mask = pc.BODYGROUP_TRIGGER;
    
    // Define the group according to RigidbodyLayers attributes
    if (this.maskAll) {
        body.mask |= (pc.BODYMASK_ALL);
    }
    
    if (this.maskEnvironment) {
        body.mask |= (pc.BODYGROUP_USER_1);
    }

    if (this.maskCharacters) {
        body.mask |= (pc.BODYGROUP_USER_2);
    }

    if (this.maskWeapons) {
        body.mask |= (pc.BODYGROUP_USER_3);
    }
};