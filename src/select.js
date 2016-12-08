/**
 * Boost JS Select Menu
 * A style-free select menu plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.0.1
 * @requires jQuery, boost-js
 */

(function(){

    /**
     * generates a random 4 character string
     * @return {string} random
     */
    function uniqueId() {
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    var Select = function() {
        // local instance
        var inst = this;
        // generate new id for select
        var id = inst.id !== null ? inst.id : 'select-'+ uniqueId()
        // determines if select is disabled or not
        inst.disabled = inst.source.attr('disabled') ? true : false;
        // create the select box replacement
        inst.select = $( document.createElement('span') )
            .attr('tabindex', '0')
            .attr('id', id +'-select' )
            .attr('role', 'combobox')
            .attr('aria-expanded', 'false')
            .attr('aria-autocomplete', 'list')
            .attr('aria-owns', id + '-menu' )
            .attr('aria-haspopup', 'true')
            .attr('aria-disabled', inst.disabled.toString() )
            .addClass( inst.settings.primaryClass )
            .html( inst.source[0].options[ inst.selectedOption() ].innerHTML )
            .on('click', function(){ if( !inst.disabled ) inst.toggle(); })
            .on('keydown', function(e){
                // down arrow
                if(e.keyCode === 40) {
                    if( inst.isOpen() ) {
                        inst.activeTo( inst.nextOption() );
                    } else {
                        inst.open().activeTo( inst.activeOption() );
                    }
                }
                // up arrow
                if(e.keyCode === 38) {
                    if( inst.isOpen() ) {
                        inst.activeTo( inst.prevOption() );
                    } else {
                        inst.open().activeTo( inst.activeOption() );
                    }
                }
                // space bar
                if(e.keyCode === 32) {
                    if( inst.isOpen() ) inst.changeTo( inst.activeOption() );
                    inst.toggle();
                }
                // enter/return
                if(e.keyCode === 13) {
                    if( inst.isOpen() ) {
                        inst.changeTo( inst.activeOption() ).toggle();
                    }
                }
                // tab
                if(e.keyCode === 9) {
                    if( inst.isOpen() ) inst.close();
                }
                // alphanumeric
                if( (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) ) {
                    var index = inst.findOption( String.fromCharCode(e.keyCode) );
                    inst.isOpen() ? inst.activeTo(index) : inst.changeTo(index);
                }
            })
        // create the dropdown menu for the select
        inst.menu = $( document.createElement('ul') )
            .attr('aria-hidden', 'false')
            .attr('aria-labelledby', inst.select[0].id )
            .attr('id', inst.select.attr('aria-owns') )
            .attr('role', 'listbox')
            .attr('tabindex', '-1')
            .attr('aria-disabled', 'false')
            .css('position', 'absolute')
            .addClass( inst.settings.primaryClass + '-menu' );
        // create each option from the select menu
        inst.source.children().each(function(index){
            // create li element as option
            var option = $(document.createElement('li'))
                .attr('id', id+'-option-'+index)
                .attr('role', 'option')
                .attr('tabindex', '-1')
                .attr('aria-selected', 'false')
                .addClass( inst.settings.primaryClass + '-option' )
                .html( this.innerHTML )
                .on('mouseenter', function(){ inst.activeTo( index ); })
                .on('click', function(){
                    inst.select[0].focus();
                    inst.changeTo( index ).close();
                })
            // add additional attributes if selected
            if( index === inst.selectedOption() ) {
                option
                    .addClass( inst.settings.activeClass )
                    .addClass( inst.settings.selectedClass )
                    .attr('aria-selected', 'true')
            }
            // append new item to menu
            inst.menu[0].appendChild(option[0]);
        });
        // store list of options in attribute
        inst.options = inst.menu.children();
        // update default values for attributes on select and menu that reference options
        inst.select
            .attr('aria-labelledby', inst.options[ inst.selectedOption() ].id )
            .add( inst.menu )
            .attr('aria-activedescendant', inst.options[ inst.selectedOption() ].id )
        // update for attribute of the label and set focus 
        // to select if it is clicked
        if( inst.id !== null ) {
            $( 'label[for="'+inst.id+'"]' )
                .attr( 'for', inst.select[0].id )
                .on('click', function(){
                    inst.select[0].focus();
                });
        }
        // close the menu if click outside the menu
        $(document).on('click', function(){
            if( inst.isOpen() ) inst.close();
        });
        inst.menu.add(inst.select).on('click', function(event){
            event.stopPropagation();
        });
        // if select is disabled, disable it
        if( inst.disabled ) inst.disable();
        // replace the original select with our new one by
        // hiding it and appending the new one before it
        inst.source.css('display','none');
        inst.source[0].parentNode.insertBefore( inst.select[0], inst.source[0] );
        // run the onInit callback
        if( $.isFunction(inst.settings.onInit) ) inst.settings.onInit.call(inst);
    }

    Select.prototype = {
        /**
         * changes the selected option by index
         * @param {integer} index
         * @param {function} callback
         * @return {object} instance
         */
        changeTo: function( index, callback ) {
            // local instance
            var inst = this;
            // make sure index is 1) not negative 2) not greater than
            // the number of options 3) not the currently selected option
            if( index >= 0 && index < inst.options.length && index !== inst.selectedOption() ) {
                // update attribute on previously selected option
                $(inst.options[ inst.selectedOption() ])
                    .removeClass( inst.settings.selectedClass )
                    .attr('aria-selected','false');
                // update attribute on newly selected option
                $( inst.options[ index ] )
                    .addClass( inst.settings.selectedClass )
                    .attr( 'aria-selected', 'true' )
                // update the selected option in select element
                inst.source[0].selectedIndex = index;
                // update the html of the select
                inst.select.html( inst.options[ index ].innerHTML );
                // update the active option
                inst.activeTo( index );
                // update the labelledby on select element
                inst.select.attr('aria-labelledby', inst.options[ index ].id )
                // run the callbacks
                if( $.isFunction(callback) ) callback.call(this);
                if( $.isFunction(inst.settings.onChange) ) inst.settings.onChange.call(this);
            }
            // return instance
            return inst;
        },
        /**
         * updates the active option in the menu
         * @param {integer} index
         * @return {object} instance
         */
        activeTo: function( index ) {
            // local instance
            var inst = this;
            // make sure index is 1) not negative 2) not greater than the number of options
            if( index >= 0 && index < inst.options.length ) {
                // update attribute on previously active option
                $( inst.options[ inst.activeOption() ] )
                    .removeClass( inst.settings.activeClass )
                // update attribute on newly selected option
                $( inst.options[ index ] )
                    .addClass( inst.settings.activeClass )
                // update the active descendant on select element
                inst.select.add( inst.menu ).attr('aria-activedescendant', inst.options[ index ].id )
            }
            // return instance
            return inst;
        },
        /**
         * retrieve the index of the selected option from 
         * the original select element
         * @return {integer} index
         */
        selectedOption: function() {
            return this.source[0].selectedIndex;
        },
        /**
         * retrieve the index of option currently highlighted
         * in the select menu
         * @return {integer} index
         */
        activeOption: function() {
            var active = this.options.filter('.'+this.settings.activeClass);
            return this.options.index( active[0] );
        },
        /**
         * get the index of the next option in the list relative
         * to the currently active (highlighted) one in menu.
         * @return {integer} index
         */
        nextOption: function() {
            var index = this.activeOption();
            return index ===  this.options.length-1 ? index : index+1;
        },
        /**
         * get the index of the previous option in the list relative
         * to the currently active (highlighted) one in menu.
         * @return {integer} index
         */
        prevOption: function() {
            return this.activeOption() === 0 ? 0 : this.activeOption()-1;
        },
        /**
         * searches through the list of options for the first value
         * who's first character matches the given character
         * @param {alpha} character
         * @return {integer} index
         */
        findOption: function( character ) {
            var index = this.activeOption();
            for( var i=0; i<this.options.length; i++ ) {
                if( (new RegExp('^'+character,'i')).test(this.options[i].innerHTML) ) {
                    index = i; break;
                }
            }
            return index;
        },
        /**
         * opens the options menu
         * @param  {function} callback
         * @return {object} instance
         */
        open: function( callback ) {
            // local instance
            var inst = this;
            // make sure it is hidden before opening
            if( !inst.isOpen() ) {
                // add open attributes to select
                inst.select
                    .attr( 'aria-expanded', 'true' );
                // add open attributes to menu
                inst.menu
                    .addClass( inst.settings.openClass )
                    .attr('aria-hidden', 'false');
                // position tip relative to source
                inst.setPosition();
                // append menu to the body
                document.body.appendChild(inst.menu[0]);
                // run the callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onOpen) ) inst.settings.onOpen.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * hides the options menu
         * @param  {function} callback
         * @return {object} instance
         */
        close: function( callback ) {
            // local instance
            var inst = this;
            // make sure it is open before closing
            if( inst.isOpen() ) {
                // add open attributes to select
                inst.select
                    .attr( 'aria-expanded', 'false' );
                // remove open attributes to menu
                inst.menu
                    .removeClass( inst.settings.openClass )
                    .attr('aria-hidden', 'true');
                // remove menu from the body
                document.body.removeChild(this.menu[0]);
                // if active option does not match selected, update it
                if( inst.activeOption() !== inst.selectedOption() ) {
                    inst.activeTo( inst.selectedOption() );
                }
                // run the callbacks
                if( $.isFunction(callback) ) callback.call(this);
                if( $.isFunction(inst.settings.onClose) ) inst.settings.onClose.call(this);
            }
            // return instance
            return this;
        },
        /**
         * toggles the options open and closed
         * @param  {function} callback
         * @return {object} instance
         */
        toggle: function( callback ) {
            return this.isOpen() ? this.close( callback ) : this.open( callback );
        },
        /**
         * determines if menu is visible or not
         * @return {boolean}
         */
        isOpen: function() {
            return document.body.contains(this.menu[0]) 
                && this.menu.hasClass( this.settings.openClass );
        },
        /**
         * calculates the sets the top/left position for the options menu
         * relative to the bottom left corner of the select
         * @param  {function} callback
         * @return {object} instance
         */
        setPosition: function() {
            // local instance
            var inst = this;
            // get the rect for the select element
            var selectRect = inst.select[0].getBoundingClientRect();
            // set the top and left position for the menu
            inst.menu.css( 'top', selectRect.bottom+'px' );
            inst.menu.css( 'left', selectRect.left+'px' );
            // match select width if setting set
            if( inst.settings.matchWidth ) {
                inst.menu.css( 'width', selectRect.width );
            }
            // return instance
            return inst;
        },
        /**
         * disables the select
         * @param  {function} callback
         * @return {object} instance
         */
        disable: function() {
            this.select
                .addClass( this.settings.disabledClass )
                .attr('tabindex', '-1')
            this.disabled = true;
            return this;
        },
        /**
         * enable the select
         * @param  {function} callback
         * @return {object} instance
         */
        enable: function() {
            this.select
                .removeClass( this.settings.disabledClass )
                .attr('tabindex', '0')
            this.disabled = false;
            return this;
        }
    }

    var plugin = {
        plugin: Select,
        defaults: {
            openClass: 'is-open',
            activeClass: 'is-active',
            selectedClass: 'is-selected',
            primaryClass: 'select',
            disabledClass: 'is-disabled',
            matchWidth: false,
            onOpen: null,
            onClose: null,
            onChange: null,
            onInit: null
        }
    }

    // if node, return via module.exports
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = plugin;
    // otherwise, save object to jquery globally
    } else if( typeof window !== 'undefined' && typeof window.$ !== 'undefined' && typeof window.$.fn.boost !== 'undefined' ) {
        window.$.fn.boost.select = plugin;
    }

})();