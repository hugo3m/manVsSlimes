/**
 * Button is a script to trigger an event on click
 */
var Button = pc.createScript('button');

// Event fired on click
Button.attributes.add('onClick', {type: 'string', default: "", title:"Event fire on click"});

/**
 * Initialize the button
 * @function initialize
 * @return {null}
 */
Button.prototype.initialize = function() {
    // Register to the click event on the button
    this.entity.button.on('click', function(event) {
        // Fire the attribute event
        this.app.fire(this.onClick);
    }, this);
};

