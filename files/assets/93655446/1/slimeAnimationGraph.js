var SlimeAnimationGraph = pc.createScript('slimeAnimationGraph');

SlimeAnimationGraph.prototype.onEvent = function(entity){
    /**
     * Update action and direction onInput
     * @return {Undefined}       Properly formatted initials.
    */
    // Read current state
    const x = entity.script.characterModel.input.left && entity.script.characterModel.input.right ? 0 : (entity.script.characterModel.input.left ? 1 : (entity.script.characterModel.input.right ? -1 : 0));
    const z = entity.script.characterModel.input.up && entity.script.characterModel.input.down ? 0 : (entity.script.characterModel.input.up ? 1 : (entity.script.characterModel.input.down ? -1 : 0));
    // Retrieve the next state from current State
    const nextState = this.getNextState(
        entity, 
        {
            "x" : x, 
            "z": z, 
            "isAttacking": entity.script.characterModel.isAttacking, 
            "isAttacked": entity.script.characterModel.isAttacked, 
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

SlimeAnimationGraph.prototype.getNextState = function(entity, event){
    /**
     * Return nextState from currentState and event
     * @return {String}       nextState: one of the state available
    */
    transitionToNextState = {
        // State Idle_left
        "Idle_left": function(event){
            switch(event.health){
                case 0:
                    return "Die_left";
                default:
                    // First check if attack
                    switch(event.isAttacked){
                        // If true attack in the same direction
                        case true:
                            return "Hit_left";
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
        "Idle_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacked){
                    case true:
                        return "Hit_right";
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
        "Walk_left": function(event){
            switch(event.health){
                case 0:
                    return "Die_left";
                default:
                    switch(event.isAttacked){
                    case true:
                        return "Hit_left";
                    default:
                        switch(event.x){
                            case 1:
                                return "Walk_left";
                            case -1:
                                return "Walk_right";
                            case 0:
                                switch(event.z){
                                    case 0:
                                        return "Idle_left";
                                    default:
                                        return "Walk_left";
                                }
                        }
                    }
            }
            
        },
        "Walk_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacked){
                    case true:
                        return "Hit_right";
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
        "Hit_left": function(event){
            switch(event.health){
                case 0:
                    return "Die_left";
                default:
                    switch(event.isAttacked){
                    case true:
                        return "Hit_left";
                    case false:
                        switch(event.attack){
                        case true:
                            return "Attack_left";
                        default:
                            switch(event.x){
                                case 1:
                                    return "Walk_left";
                                case -1:
                                    return "Walk_right";
                                case 0:
                                    switch(event.z){
                                        case 0:
                                            return "Idle_left";
                                        default:
                                            return "Walk_left";
                                    }
                            }
                        }
                    }
                }
        },
        "Hit_right": function(event){
            switch(event.health){
                case 0:
                    return "Die_right";
                default:
                    switch(event.isAttacked){
                    case true:
                        return "Hit_right";
                    case false:
                        switch(event.attack){
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
            }
        },
        "Die_left": function(event){
            return "Die_left";
        },
        "Die_right": function(event){
            return "Die_right";
        }
    };
    return transitionToNextState[entity.script.characterModel.getAnimationName(entity.script.characterModel.action, entity.script.characterModel.direction)](event);
};