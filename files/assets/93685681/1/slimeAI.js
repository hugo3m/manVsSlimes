
/**
 * SlimeAi handles all the logic of the AI system of the slimes
 */
var SlimeAi = pc.createScript('slimeAi');
// Create vector 3D in the physic world handled by Ammo
// Check more about Ammo and Three
SlimeAi.v1 = new Ammo.btVector3();
SlimeAi.v2 = new Ammo.btVector3();

// Entity target of the slime
SlimeAi.attributes.add('target', {type: 'entity', title: 'Target Entity'});
// Int movement range of the slime before going to new direction
SlimeAi.attributes.add('movementRange', {type: 'number', default:2, title: 'Movement range'});
// Int view range i.e. how far the slime can see
SlimeAi.attributes.add('viewRange', {type: 'number', default:2, title: 'View range'});
// Int gap range uses to define when the slime is on the good trajectory
SlimeAi.attributes.add('gapRange', {type: 'number', default:0.1414, title: 'Gap range'});
// Int close range to define when the slime is close enough to its destination
SlimeAi.attributes.add('closeRange', {type: 'number', default:0.1, title: 'Close range'});

/**
 * Initialize code called once per entity
 * @function initialize
 * @return {null}
 */
SlimeAi.prototype.initialize = function() {
    // If slime is able to see target
    this.canSeeTarget = false;
    // Distance to current destination
    this.distanceToDestination = new pc.Vec2(this.entity.getPosition().x, this.entity.getPosition().z).distance(this.destination);
};

/**
 * Update on every delta fime
 * @function update
 * @param {Int} dt Delta time
 * @return {null}
 */
SlimeAi.prototype.update = function(dt){
    // Update if the slime can see the target
    this.updateCanSeeTarget();
    // Update slime destination
    this.updateDestination();
    // Go to destination
    this.goToDestination();
};

/**
 * Update if the slime can see the target
 * @function updateCanSeeTarget
 * @return {null}
 */
SlimeAi.prototype.updateCanSeeTarget = function(){
    // If the slime is inside the world
    if(this.entity.script.rigidbodyLayers.characters){
        // Retrieve the distance between the slime and the target
        const distanceToTarget = new pc.Vec2(this.entity.getPosition().x, this.entity.getPosition().z).distance(new pc.Vec2(this.target.getPosition().x, this.target.getPosition().z));
        // If the target is in range
        if (distanceToTarget < this.viewRange){
            // Check whats the first rigidbody between the slime and the target i.e. can see it
            const result = this.raycastFirst(this.entity.getPosition(), this.target.getPosition());
            // If the first rigidbody is the target, slime can see the target
            if(result !== null) this.canSeeTarget = result.entity === this.target;
            else this.canSeeTarget = false;
        }
        // If too far slime can not see the target
        else this.canSeeTarget = false;
    }
};

/**
 * Update the slime destination
 * @function updateDestination
 * @return {null}
 */
SlimeAi.prototype.updateDestination = function(){
    // If the slime is already too close to the destination, set new random destination
    if(this.distanceToDestination < this.closeRange) this.setRandomDestination();
    // If can see the target
    if (this.canSeeTarget) {
        // Destination is set to target position
        this.destination.copy(new pc.Vec2(this.target.getPosition().x, this.target.getPosition().z));
    }
    // Compute distance to destination
    this.distanceToDestination = new pc.Vec2(this.entity.getPosition().x, this.entity.getPosition().z).distance(this.destination);
};

/**
 * Lead the slime to the destination
 * @function goToDestination
 * @return {null}
 */
SlimeAi.prototype.goToDestination = function(){
    // Vector of the direction from the entity to the destination
    const entityToDestination = new pc.Vec2(this.destination.x - this.entity.getPosition().x, this.destination.y - this.entity.getPosition().z);
    // If the slime is to far
    if(this.distanceToDestination > this.closeRange * 2){
        // If the Y position is above the gap
        if(entityToDestination.y > this.gapRange){
            // Make the slime going up into the gap
            if (!this.entity.script.characterModel.input.up) this.entity.script.slimeController.inputUp(true);
            if (this.entity.script.characterModel.input.down) this.entity.script.slimeController.inputDown(false);
        }
        // If the Y position is below the gap
        if(entityToDestination.y < -this.gapRange){
            // Make the slime going down into the gap
            if (this.entity.script.characterModel.input.up) this.entity.script.slimeController.inputUp(false);
            if (!this.entity.script.characterModel.input.down) this.entity.script.slimeController.inputDown(true);
        }
        // If the X position if above the gap
        if(entityToDestination.x > this.gapRange){
            // Make the slime going left into the gap
            if (!this.entity.script.characterModel.input.left) this.entity.script.slimeController.inputLeft(true);
            if (this.entity.script.characterModel.input.right) this.entity.script.slimeController.inputRight(false);
        }
        // If the X position is below the gap
        if(entityToDestination.x < -this.gapRange){
            // Make the slime going right into the gap
            if (this.entity.script.characterModel.input.left) this.entity.script.slimeController.inputLeft(false);
            if (!this.entity.script.characterModel.input.right) this.entity.script.slimeController.inputRight(true);
        }
    }
    // If the slime is inside the superior vertical gap
    if(entityToDestination.y < this.gapRange){
        // If it is going left or right, stop going up
        if (this.entity.script.characterModel.input.up && (this.entity.script.characterModel.input.left || this.entity.script.characterModel.input.right)) this.entity.script.slimeController.inputUp(false);
    }
    // If the slime is inside the inferior vertical gap
    if(entityToDestination.y > -this.gapRange){
        // If it is going left or right, stop going down
        if (this.entity.script.characterModel.input.down && (this.entity.script.characterModel.input.left || this.entity.script.characterModel.input.right)) this.entity.script.slimeController.inputDown(false);
    }
    // If the slime is inside the superior horizontal gap
    if(entityToDestination.x < this.gapRange){
        // If it is going up or down, stop going left
        if (this.entity.script.characterModel.input.left && (this.entity.script.characterModel.input.down || this.entity.script.characterModel.input.up)) this.entity.script.slimeController.inputLeft(false);
    }
    // If the slime is inside the inferior vertical gap
    if(entityToDestination.x > -this.gapRange){
        // If it is going up or down, stop going right
        if (this.entity.script.characterModel.input.right && (this.entity.script.characterModel.input.down || this.entity.script.characterModel.input.up)) this.entity.script.slimeController.inputRight(false);
    }
    
};

/**
 * Set a random destination
 * @function setRandomDestination
 * @return {null}
 */
SlimeAi.prototype.setRandomDestination = function () {
    // Get random x position between slime position and movement range
    var xPosition = pc.math.random(this.entity.getPosition().x - this.movementRange, this.entity.getPosition().x + this.movementRange);
    // Get random z position between slime position and movement range
    var zPosition = pc.math.random(this.entity.getPosition().z - this.movementRange, this.entity.getPosition().z + this.movementRange);
    // While the slime is too close to the new position
    while(new pc.Vec2(this.entity.getPosition().x, this.entity.getPosition().z).distance(new pc.Vec2(xPosition, zPosition)) < this.closeRange ){
        // Retrieve new destination
        xPosition = pc.math.random(this.entity.getPosition().x - this.movementRange, this.entity.getPosition().x + this.movementRange);
        zPosition = pc.math.random(this.entity.getPosition().z - this.movementRange, this.entity.getPosition().z + this.movementRange);
    }
    // Set new destination
    this.destination.copy(new pc.Vec2(xPosition, zPosition));
    // Compute the distance to the destination
    this.distanceToDestination = new pc.Vec2(this.entity.getPosition().x, this.entity.getPosition().z).distance(this.destination);
};

/**
 * Raycast from start to end and return first rigidbody
 * @function raycast first
 * @param {Vec3} start Start of the raycast
 * @param {Vec3} end end of the raycast
 * @return {Entity} first entity hits by the raycast
 */
SlimeAi.prototype.raycastFirst = function(start, end) {
    // Initial result to null
    let result = null;
    // Retrieve physical vector
    const ammoRayStart = SlimeAi.v1;
    const ammoRayEnd = SlimeAi.v2;
    // Set vector value according to start and end
    ammoRayStart.setValue(start.x, start.y, start.z);
    ammoRayEnd.setValue(end.x, end.y, end.z);
    // Create object to raycast between start and end
    const rayCallback = new Ammo.ClosestRayResultCallback(ammoRayStart, ammoRayEnd);
    // Set the collision group and mask of the slime
    rayCallback.m_collisionFilterGroup = this.entity.rigidbody.group;
    rayCallback.m_collisionFilterMask = this.entity.rigidbody.mask;
    // Start the raycast
    this.app.systems.rigidbody.dynamicsWorld.rayTest(ammoRayStart, ammoRayEnd, rayCallback);
    // If it hits
    if (rayCallback.hasHit()) {
        // Retrieve the entity
        const collisionObj = rayCallback.get_m_collisionObject();
        const body = Ammo.castObject(collisionObj, Ammo.btRigidBody);
        if (body) {
            const point = rayCallback.get_m_hitPointWorld();
            const normal = rayCallback.get_m_hitNormalWorld();

            result = new pc.RaycastResult(
                body.entity,
                new pc.Vec3(point.x(), point.y(), point.z()),
                new pc.Vec3(normal.x(), normal.y(), normal.z())
            );
        }
    }

    Ammo.destroy(rayCallback);

    return result;
};
