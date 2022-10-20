/**
 * Script handling the graph to play the player's animation
 */
var PlayerAnimationGraph = pc.createScript('playerAnimationGraph');

/**
 * Handle event and change the player animation according to the event and current state
 * @function onEvent
 * @param {entity} entity Entity to which an event happened
 * @return {null}
 */
PlayerAnimationGraph.prototype.onEvent = function(entity){
    // Read current direction of the characrer
    const x = entity.script.characterModel.input.left && entity.script.characterModel.input.right ? 0 : (entity.script.characterModel.input.left ? 1 : (entity.script.characterModel.input.right ? -1 : 0));
    const z = entity.script.characterModel.input.up && entity.script.characterModel.input.down ? 0 : (entity.script.characterModel.input.up ? 1 : (entity.script.characterModel.input.down ? -1 : 0));
    // Retrieve the next state from current State
    const nextState = this.getNextState(
        entity, 
        {
            "x" : x, 
            "z": z, 
            "isAttacking": entity.script.characterModel.isAttacking,
            "health": entity.script.characterModel.health
        });
    // Retrieve next action and next direction
    const [nextAction, nextDirection] = entity.script.characterModel.getActionDirectionFromAnimationName(nextState);
    // If the action or direction is different from current action or direction
    if(nextAction !== entity.script.characterModel.action || nextDirection !== entity.script.characterModel.direction){
        // Set them
        entity.script.characterModel.action = nextAction;
        entity.script.characterModel.direction = nextDirection;
        // If next action is attack set isAttacking
        if (entity.script.characterModel.action == "Attack") entity.script.characterModel.isAttacking = true;
        // Play the appropriate animation
        entity.sprite.play(entity.script.characterModel.getAnimationName(entity.script.characterModel.action, entity.script.characterModel.direction));
    }
};

/**
 * Return the next state according to the entity and the event
 * @function getNextState
 * @param {Entity} entity Entity holding current state
 * @param {Object} event Json object holding event information
 * @return {[String,String]} action,direction Returns the action and the direction
 */
PlayerAnimationGraph.prototype.getNextState = function(entity, event){
    // Object handling the transition between state
    transitionToNextState = {
        // If state is Idle_left
        "Idle_left": function(event){
            // Check the health of the character
            switch(event.health){
                // If 0, character dies
                case 0:
                    return "Die_left";
                // Else
                default:
                    // Check if attack
                    switch(event.isAttacking){
                        // If true attack in the same direction
                        case true:
                            return "Attack_left";
                        // Otherwise
                        default:
                            // Check x input
                            switch(event.x){
                                // Positive = left
                                case 1:
                                    return "Walk_left";
                                // Negative = right
                                case -1:
                                    return "Walk_right";
                                // None
                                case 0:
                                    // Check z input
                                    switch(event.z){
                                        // None = Idle_left
                                        case 0:
                                            return "Idle_left";
                                        // Walk_left otherwise    
                                        default:
                                            return "Walk_left";
                                    }
                            }
                    }
            }
            
        },
        // Same as Idle_left
        "Idle_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacking){
                        case true:
                            return "Attack_right";
                        default:
                            switch(event.x){
                                case 1:
                                    return "Walk_left";
                                case -1:
                                    return "Walk_right";
                                case 0:
                                    switch(event.z){
                                        case 0:
                                            return "Idle_right";
                                        default:
                                            return "Walk_right";
                                    }
                            }
                    }
            }
            
        },
        // If is walking left
        "Walk_left": function(event){
            // Check the health of the character
            switch(event.health){
                // If 0 dies
                case 0:
                    return "Die_left";
                // Else
                default:
                    // Check is attacking
                    switch(event.isAttacking){
                        // If is attacking, attack in same direction
                        case true:
                            return "Attack_left";
                        // Else
                        default:
                            // Check x input
                            switch(event.x){
                                // Positive on the left
                                case 1:
                                    return "Walk_left";
                                // Negative on the right
                                case -1:
                                    return "Walk_right";
                                // If 0
                                case 0:
                                    // Check z input
                                    switch(event.z){
                                        // If 0 idle
                                        case 0:
                                            return "Idle_left";
                                        // Else walk left
                                        default:
                                            return "Walk_left";
                                    }
                            }
                    }   
            }
            
        },
        // Same as walk left
        "Walk_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacking){
                    case true:
                        return "Attack_right";
                    default:
                        switch(event.x){
                            case 1:
                                return "Walk_left";
                            case -1:
                                return "Walk_right";
                            case 0:
                                switch(event.z){
                                    case 0:
                                        return "Idle_right";
                                    default:
                                        return "Walk_right";
                                }
                        }
                }
            }
            
        },
        // If attack left
        "Attack_left": function(event){
            // Check character's health
            switch(event.health){
                // If 0 die
                case 0:
                    return "Die_left";
                // Else
                default:
                    // Check is attacking
                    switch(event.isAttacking){
                        // If true attack
                        case true:
                            return "Attack_left";
                        // Else
                        default:
                            // Check X input
                            switch(event.x){
                                // Positive left
                                case 1:
                                    return "Walk_left";
                                // Negative right
                                case -1:
                                    return "Walk_right";
                                // If 0
                                case 0:
                                    // Check Z input
                                    switch(event.z){
                                        // 0 idle
                                        case 0:
                                            return "Idle_left";
                                        // Else walk left
                                        default:
                                            return "Walk_left";
                                    }
                            }
                }
            }
            
        },
        // Same as attack left
        "Attack_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacking){
                    case true:
                        return "Attack_right";
                    default:
                        switch(event.x){
                            case 1:
                                return "Walk_left";
                            case -1:
                                return "Walk_right";
                            case 0:
                                switch(event.z){
                                    case 0:
                                        return "Idle_right";
                                    default:
                                        return "Walk_right";
                                }
                        }
                }
            }
            
        },
        // If dead
        "Die_right": function(event){
            // Still dead
            return "Die_right";
        },
        // If dead
        "Die_left": function(event){
            // Still dead
            return "Die_left";
        }
    };
    // Return the next state from the current animation which holds the current state and the event
    return transitionToNextState[entity.script.characterModel.getAnimationName(entity.script.characterModel.action, entity.script.characterModel.direction)](event);
};