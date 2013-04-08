;(function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'plugin',
        /*
        |--------------------------------------------------------------------------
        | Options & callbacks
        */
        defaults = {
            namespace: 'rc',
            onClick  : function(){}

        },
        methods = {
            /*
            |--------------------------------------------------------------------------
            | Public methods
            */
            init: function () {
                console.log('Init');
            },
            /*
            |--------------------------------------------------------------------------
            | Private methods
            */
            // Callback function definition
            _call: function(fn) {
                var clb = 'on'+fn.charAt(0).toUpperCase() + fn.slice(1); //append the on prefix for callback functions
                var args = Array.prototype.slice.call( arguments, 1 );
                if (typeof this.options[clb] === 'function') { // make sure the callback is a function
                    args.push(this.el,this);
                    this.options[clb].apply(this, args ); // brings the scope to the callback
                }
            }
        };


    function Plugin( el, options ) {
        this.el = el;
        this.$el = $(el);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    //extend the methods
    Plugin.prototype = methods;

    $.fn[pluginName] = function ( options ) {
        var args = arguments;
        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {

            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if ( typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})(jQuery, window, document);
