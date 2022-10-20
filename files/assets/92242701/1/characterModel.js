/**
 * CharacterModel stores attributes of a character entity
 */
var CharacterModel = pc.createScript('characterModel');

// Speed of the character
CharacterModel.attributes.add('speed', {type: 'number', default: 100});
// Health of the character
CharacterModel.attributes.add('health', {type: 'number', default: 4});

/**
 * Initialize
 * @function initialize
 * @return {null}
 */
CharacterModel.prototype.initialize = function() {
    // State for moving the character
    this.input = {
        "left": false,
        "right": false,
        "up": false,
        "down":false
    };
    // State for the action and direction of the character according to its display
    [this.action, this.direction] = this.getActionDirectionFromAnimationName(this.entity.sprite.autoPlayClip);
    // State for knowing if the character is attacking
    this.isAttacking = false;
    // State for knowing if the character is attacked
    this.isAttacked = false;
};

/**
 * Return the name of the animation according to direction and action
 * @function getAnimationName
 * @param {String} action Action of the character
 * @param {String} direction Direction of the character
 * @return {String} the name of the animation (Die_right, Attack_left, Idle_right)
 */
CharacterModel.prototype.getAnimationName = function(action, direction){
    return action + "_" + direction;
};

/**
 * Return action and direction according to the animation name
 * @function getActionDirectionFromAnimationName
 * @param {String} clipName Name of the clip played by the character
 * @return {[String, String]} [action,direction]
 */
CharacterModel.prototype.getActionDirectionFromAnimationName = function(clipName){
    return clipName.split("_");
};
 