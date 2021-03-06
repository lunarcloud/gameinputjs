/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.custom.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['gi'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node, CommonJS-like
        module.exports = factory(require(gi));
    } else {
        // Browser globals (root is window)
        root.gi = factory(root.gi);
    }
}(this, function (gi) {
    "use strict";
    if (typeof(gi) == "undefined") throw "GameInput JS must be included first!";

    /**
     * gi.CustomLearning
     * @brief   Game Input System Learning Functionality
     * @desc    System for mapping a gamepad or keyboard control scheme by prompts
     */
    gi.CustomLearning = {};

    var ignorable = {};
    var customMappings = {};

    /* Event Handlers */
    var detectIgnorableBeginHandlers = [];
    var detectIgnorableDiscoverHandlers = [];
    var detectIgnorableCompleteHandlers = [];
    var beginMappingHandlers = [];
    var listeningForMappingHandlers = [];
    var setMappingHandlers = [];
    var completeMappingHandlers = [];

    /**
      * @desc   Setup a function to fire when axes ignore detection event starts, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onDetectIgnorableBegin = function(handler) {
        detectIgnorableStartHandlers.push(handler);
    };
    /**
      * @desc   Setup a function to fire when axes ignore detection event finds an item, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onDetectIgnorableDiscover = function(handler) {
        detectIgnorableDiscoverHandlers.push(handler);
    };

    /**
      * @desc   Setup a function to fire when axes ignore detection event ends, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onDetectIgnorableComplete = function(handler) {
        detectIgnorableCompleteHandlers.push(handler);
    };

    /**
      * @desc   Setup a function to fire when begin mapping event occurs, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onBeginMapping = function(handler) {
        beginMappingHandlers.push(handler);
    };

    /**
      * @desc   Setup a function to fire when listening event occurs, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onListeningForMappingItem = function(handler) {
        listeningForMappingHandlers.push(handler);
    };

    /**
      * @desc   Setup a function to fire when set event occurs, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onSetMappingItem = function(handler) {
        setMappingHandlers.push(handler);
    };

    /**
      * @desc   Setup a function to fire when complete mapping event occurs, used for display purposes.
      * @param  handler     the function to handle the event
      */
    gi.CustomLearning.onCompleteMapping = function(handler) {
        completeMappingHandlers.push(handler);
    };

    /**
      * @desc   Detects erratic / noisy items to ignore while mapping, such as accelerometers or broken sticks
      * @param  player      index of the player whose noisy axes we're listening for
      */
    gi.CustomLearning.detectIgnorable = function(player) {
        ignorable[player] = {};

        //TODO fire detectIgnorableBeginHandlers handlers with the player

        if ( gi.getPlayer(player).schema instanceof gi.Schema.KeyboardAPI ) {
        } else /* if (gi.getPlayer(player).schema instanceof gi.Schema.GamePadAPI) */ {
        }

        //TODO
        //TODO fire detectIgnorableDiscoverHandlers handlers with the player

        //TODO fire detectIgnorableCompleteHandlers handlers with the player
    };

    /**
      * @desc   Creates a new Custom Mapping
      * @param  player      index of the player to create a mapping for
      */
    gi.CustomLearning.beginCustomMapping = function(player) {
        customMappings[player] = {};

        if ( gi.getPlayer(player).schema instanceof gi.Schema.KeyboardAPI ) {
        } else /* if (gi.getPlayer(player).schema instanceof gi.Schema.GamePadAPI) */ {
        }
        //TODO
        //TODO listen for each item
        //TODO fire beginMappingHandlers handlers with the player
    };

    /**
      * @desc   Listens for a mapping item
      * @param  player      index of the player whose gamepad to listen to
      * @param  schemaName  one of the gi.Schema.Names
      */
    gi.CustomLearning.listenForMappingItem = function(player, schemaName) {

        if ( gi.getPlayer(player).schema instanceof gi.Schema.KeyboardAPI ) {
        } else /* if (gi.getPlayer(player).schema instanceof gi.Schema.GamePadAPI) */ {
        }

        //TODO
        //TODO if threshold oof an axis (not in ignorable) is above 0.5 or if a button is true, setMappingItem to that
        //TODO fire listeningForMappingHandlers handlers with the player and schemaName
    };

    /**
      * @desc   Sets an item in the custom mapping being made
      * @param  player      index of the player to configure this button for
      * @param  schemaName  one of the gi.Schema.Names
      * @param  button      button to assign to the schemaName'd item
      */
    gi.CustomLearning.setMappingItem = function(player, schemaName, button) {

        if ( gi.getPlayer(player).schema instanceof gi.Schema.KeyboardAPI ) {
        } else /* if (gi.getPlayer(player).schema instanceof gi.Schema.GamePadAPI) */ {
        }

        //TODO
        //TODO fire setMappingHandlers handlers with the player, schemaName, and button
    };

    /**
      * @desc   Finalized and assigns mapping
      * @param  player      index of the player to finish mapping for
      */
    gi.CustomLearning.completeCustomMapping = function(player) {

        if ( gi.getPlayer(player).schema instanceof gi.Schema.KeyboardAPI ) {
        } else /* if (gi.getPlayer(player).schema instanceof gi.Schema.GamePadAPI) */ {
        }

        //TODO
        //TODO fire completeMappingHandlers handlers with the player
    };

    return gi;
}));

/**
 * @preserve
 * @license-end
 */
