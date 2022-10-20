/**
 * Camera is the script of the camera to follow the attribute entityToFollow
 */
var Camera = pc.createScript('camera');

// Entity to follow
Camera.attributes.add('entityToFollow', {type: 'entity'});


/**
 * Update the position of the camera according to the entity followed
 * @function update
 * @param {Int} dt
 * @return {null}
 */
Camera.prototype.update = function(dt) {
    // Retrieve camera position
    const cameraPosition = this.entity.getPosition();
    // Retrieve the position of the entity to follow
    const toFollowPosition = this.entityToFollow.getPosition();
    // If X and Z values different between the camera and the entity to follow
    if(cameraPosition.x !== toFollowPosition.x || cameraPosition.z !== toFollowPosition.z)
        // Move the camera position
        this.entity.setPosition(new pc.Vec3(toFollowPosition.x, cameraPosition.y, toFollowPosition.z));
};
