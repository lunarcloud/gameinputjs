/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
"use strict";

if (typeof(GameInput) == "undefined") throw "GameInput JS must be included first!";

/**
 * GameInput.CustomLearning
 * @brief   Game Input System Learning Functionality
 * @desc    System for mapping a gamepad or keyboard control scheme by prompts
 */
gi.CustomLearning = {};

// encapsulate
(function(){
    "use strict";

    var ignorableAxes = {};
    var customMappings = {};

    /**
      * @desc   Detects erratic / noisy axes to ignore while mapping, such as accelerometers or broken sticks
      * @param  player      index of the player whose noisy axes we're listening for
      */
    gi.CustomLearning.detectIgnorableAxes = function(player) {
        ignorableAxes[player] = {};
        //TODO
    }

    /**
      * @desc   Creates a new Custom Mapping
      * @param  player      index of the player to create a mapping for
      */
    gi.CustomLearning.beginCustomMapping = function(player) {
        customMappings[player] = {};
        //TODO
        //TODO listen for each item
    }

    /**
      * @desc   Listens for a mapping item
      * @param  player      index of the player whose gamepad to listen to
      * @param  schemaName  one of the gi.Schema.Names
      */
    gi.CustomLearning.listenForMappingItem = function(player, schemaName) {
        //TODO
    }

    /**
      * @desc   Sets an item in the custom mapping being made
      * @param  player      index of the player to configure this button for
      * @param  schemaName  one of the gi.Schema.Names
      * @param  button      button to assign to the schemaName'd item
      */
    gi.CustomLearning.setMappingItem = function(player, schemaName, button) {
        //TODO
    }


    /**
      * @desc   Finalized and assigns mapping
      * @param  player      index of the player to finish mapping for
      */
    gi.CustomLearning.completeCustomMapping = function(player) {
        //TODO
    }

})();


/**
 * @preserve
 * @license-end
 */
