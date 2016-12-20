var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

var template = {
    default: '<label for="select">Select</label>'+
    '<select id="select">'+
        '<option value="1">1</option>'+
        '<option value="2">2</option>'+
        '<option value="3">3</option>'+
        '<option value="4">4</option>'+
        '<option value="5">5</option>'+
    '</select>',
    alpha: '<label for="select">Select</label>'+
    '<select id="select">'+
        '<option value="1">a</option>'+
        '<option value="2">b</option>'+
        '<option value="3">c</option>'+
        '<option value="4">d</option>'+
        '<option value="5">e</option>'+
    '</select>',
    disabled: '<select id="select" disabled><option></option></select>',
    noID: '<select><option></option></select>',
    openClass: '<select id="select" data-open-class="foo-bar"><option></option></select>',
    activeClass: '<select id="select" data-active-class="foo-bar"><option></option></select>',
    selectedClass: '<select id="select" data-selected-class="foo-bar"><option></option></select>',
    primaryClass: '<select id="select" data-primary-class="foo-bar"><option></option></select>',
    disabledClass: '<select id="select" data-disabled-class="foo-bar"><option></option></select>'
}

describe('Boost JS Select Menu', function () {

    jsdom()

    before(function ( done ) {
        $ = require('jquery')
        boost = require('boost-js')
        select = require('../dist/select.min.js')
        $.fn.select = boost( select.plugin, select.defaults );
        done();
    });

    describe('creation', function () {

        it('should have added plugin to jQuery\'s prototype', function () {
            assert.isDefined( $.fn.select );
        });

    });

    describe('instantiation', function () {

        var inst;

        before(function ( done ) {
            document.body.innerHTML = template.default;
            inst = $('#select').select();
            done();
        });

        // default template

        it('should set disabled to false if attribute not present', function () {
            assert.isFalse( inst.disabled );
            assert.isFalse( inst.source[0].hasAttribute('disabled') );
        });

        it('should create new select element and add attributes', function () {
            assert.isDefined( inst.select );
            assert.match( inst.select[0].nodeName, /SPAN/ );
            assert.match( inst.select.attr('id'), /^select-select$/ );
            assert.match( inst.select.attr('tabindex'), /^0$/ );
            assert.match( inst.select.attr('role'), /^combobox$/ );
            assert.match( inst.select.attr('aria-expanded'), /^false$/ );
            assert.match( inst.select.attr('aria-autocomplete'), /^list$/ );
            assert.match( inst.select.attr('aria-owns'), /^select-menu$/ );
            assert.match( inst.select.attr('aria-disabled'), /^false$/ );
            assert.match( inst.select.attr('aria-haspopup'), /^true$/ );
            assert.isTrue( inst.select.hasClass('select') );
            assert.equal( inst.select.html(), inst.source[0].options[0].innerHTML );
        });

        it('should toggle menu on click of select', function () {
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger( 'click' );
            assert.isTrue( inst.menu.hasClass('is-open') );
            inst.select.trigger( 'click' );
            assert.isFalse( inst.menu.hasClass('is-open') );
        });

        it('should open menu, then navigate down on press of down arrow', function () {
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 40 }));
            assert.isTrue( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 40 }));
            assert.equal( inst.activeOption(), 1 );
            inst.close();
        });

        it('should open menu, then navigate up on press of up arrow', function () {
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 38 }));
            assert.isTrue( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 38 }));
            assert.equal( inst.activeOption(), 0 );
        });

        it('should toggle menu on press of spacebar', function () {
            inst.select.trigger($.Event("keydown", { keyCode: 32 }));
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 32 }));
            assert.isTrue( inst.menu.hasClass('is-open') );
        });

        it('should update selected option on press of spacebar', function () {
            inst.activeTo( 2 );
            inst.select.trigger($.Event("keydown", { keyCode: 32 }));
            assert.equal( inst.selectedOption(), 2 );
        });

        it('should close an open menu on press of enter', function () {
            inst.open();
            assert.isTrue( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 13 }));
            assert.isFalse( inst.menu.hasClass('is-open') );
        });

        it('should close an open menu on press of tab', function () {
            inst.open();
            assert.isTrue( inst.menu.hasClass('is-open') );
            inst.select.trigger($.Event("keydown", { keyCode: 9 }));
            assert.isFalse( inst.menu.hasClass('is-open') );
        });

        it('should update selected option when alphanumeric key is pressed and menu is closed', function () {
            assert.equal( inst.selectedOption(), 2 );
            inst.select.trigger($.Event("keydown", { keyCode: 50 }));
            assert.equal( inst.selectedOption(), 1 );
        });

        it('should update active option when alphanumeric key is pressed and menu is open', function () {
            assert.equal( inst.activeOption(), 1 );
            inst.select.trigger($.Event("keydown", { keyCode: 49 }));
            assert.equal( inst.activeOption(), 0 );
        });

        it('should create new menu element and add attributes', function () {
            assert.isDefined( inst.menu );
            assert.match( inst.menu[0].nodeName, /UL/ );
            assert.match( inst.menu.attr('aria-hidden'), /^true$/ );
            assert.match( inst.menu.attr('aria-labelledby'), /^select-select$/ );
            assert.match( inst.menu.attr('id'), /^select-menu$/ );
            assert.match( inst.menu.attr('role'), /^listbox$/ );
            assert.match( inst.menu.attr('tabindex'), /^-1$/ );
            assert.match( inst.menu.attr('aria-disabled'), /^false$/ );
            assert.match( inst.menu[0].style.position, /^absolute$/ );
            assert.isTrue( inst.menu.hasClass('select-menu') );
        });

        it('should create new option element and add attributes', function () {
            assert.isDefined( inst.options );
            assert.match( inst.options[0].nodeName, /LI/ );
            assert.equal( inst.options.length, inst.source[0].length );
            assert.match( inst.options.last().attr('id'), /^select-option-4$/ );
            assert.match( inst.options.last().attr('role'), /^option$/ );
            assert.match( inst.options.last().attr('tabindex'), /^-1$/ );
            assert.match( inst.options.last().attr('aria-selected'), /^false$/ );
            assert.isTrue( inst.options.last().hasClass('select-option') );
            assert.equal( inst.options.last().html(), inst.source[0].options[4].innerHTML );
        });

        it('should give the selected option some unique attributes', function () {
            assert.match( inst.options.first().attr('aria-selected'), /^true$/ );
            assert.isTrue( inst.options.first().hasClass('is-active') );
            assert.isTrue( inst.options.first().hasClass('is-selected') );
        });

        it('should activate option on mouseenter event', function () {
            inst.activeTo(0);
            assert.equal( inst.activeOption(), 0 );
            inst.options.last().trigger( 'mouseenter' );
            assert.equal( inst.activeOption(), 4 );
        });

        it('should select option on click event', function () {
            inst.changeTo(0);
            assert.equal( inst.selectedOption(), 0 );
            inst.options.last().trigger( 'click' );
            assert.equal( inst.selectedOption(), 4 );
        });

        it('should give the select/menu additional attributes related to the selected option', function () {
            inst.changeTo(0);
            assert.match( inst.select.attr('aria-labelledby'), /^select-option-0$/ );
            assert.match( inst.select.attr('aria-activedescendant'), /^select-option-0$/ );
            assert.match( inst.menu.attr('aria-activedescendant'), /^select-option-0$/ );
        });

        it('should find and save corresponding label and update for attribute', function () {
            assert.isDefined( inst.label );
            assert.match( inst.label[0].nodeName, /LABEL/ );
            assert.match( inst.label.attr('for'), /^select-select$/ );
        });

        it('should focus on select when label is clicked', function () {
            inst.label.trigger( 'click' );
            assert.equal( document.activeElement, inst.select[0] );
        });

        it('should close an open menu on click of document', function () {
            inst.open();
            $(document).trigger('click');
            assert.isFalse( inst.isOpen() );
        });

        it('should hide the original select and append our new one', function () {
            assert.match( inst.source.css('display'), /none/ );
            assert.equal( inst.select[0].nextSibling, inst.source[0] );
        });

        it('should append menu element to bottom of the body', function () {
            assert.equal( document.body.lastChild, inst.menu[0] );
        });

        // disabled template

        it('should NOT toggle menu on click of select when disabled', function () {
            document.body.innerHTML = template.disabled;
            inst = $('#select').select();
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger( 'click' );
            assert.isFalse( inst.menu.hasClass('is-open') );
            inst.select.trigger( 'click' );
            assert.isFalse( inst.menu.hasClass('is-open') );
        });

        it('should set disabled to true if attribute present', function () {
            assert.isTrue( inst.disabled );
            assert.isTrue( inst.source[0].hasAttribute('disabled') );
        });

        // noID template

        it('should use generated id for select if no source id', function () {
            document.body.innerHTML = template.noID;
            inst = $('select').select();
            assert.match( inst.select.attr('id'), /^select-[\w\d]{4}-select$/ );
        });

    });

    describe('settings', function () {

        it('should be able to update \'activeClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({activeClass:'foo-bar'});
            assert.isTrue( inst.options.first().hasClass('foo-bar') );
        });

        it('should be able to update \'activeClass\' setting from html', function () {
            document.body.innerHTML = template.activeClass;
            var inst = $('#select').select();
            assert.isTrue( inst.options.first().hasClass('foo-bar') );
        });

        it('should be able to update \'openClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({openClass:'foo-bar'}).open();
            assert.isTrue( inst.menu.hasClass('foo-bar') );
        });

        it('should be able to update \'openClass\' setting from html', function () {
            document.body.innerHTML = template.openClass;
            var inst = $('#select').select().open();
            assert.isTrue( inst.menu.hasClass('foo-bar') );
        });

        it('should be able to update \'selectedClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({selectedClass:'foo-bar'});
            assert.isTrue( inst.options.first().hasClass('foo-bar') );
        });

        it('should be able to update \'selectedClass\' setting from html', function () {
            document.body.innerHTML = template.selectedClass;
            var inst = $('#select').select();
            assert.isTrue( inst.options.first().hasClass('foo-bar') );
        });

        it('should be able to update \'primaryClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({primaryClass:'foo-bar'});
            assert.isTrue( inst.select.hasClass('foo-bar') );
            assert.isTrue( inst.menu.hasClass('foo-bar-menu') );
            assert.isTrue( inst.options.first().hasClass('foo-bar-option') );
        });

        it('should be able to update \'primaryClass\' setting from html', function () {
            document.body.innerHTML = template.primaryClass;
            var inst = $('#select').select();
            assert.isTrue( inst.select.hasClass('foo-bar') );
            assert.isTrue( inst.menu.hasClass('foo-bar-menu') );
            assert.isTrue( inst.options.first().hasClass('foo-bar-option') );
        });

        it('should be able to update \'disabledClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({disabledClass:'foo-bar'}).disable();
            assert.isTrue( inst.select.hasClass('foo-bar') );
        });

        it('should be able to update \'disabledClass\' setting from html', function () {
            document.body.innerHTML = template.disabledClass;
            var inst = $('#select').select().disable();
            assert.isTrue( inst.select.hasClass('foo-bar') );
        });

        it('should set the menu\'s width to width of select if \'matchWidth\' is set to true', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({matchWidth:true});
            assert.equal( inst.select.css('width'), inst.menu.css('width') );
        });

        it('should be able to add function to \'onInit\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({
                onInit: function() {
                    this.test = "foo";
                }
            });
            assert.match( inst.test, /foo/ );
        });

        it('should be able to add function to \'onOpen\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({
                onOpen: function() {
                    this.test = "foo";
                }
            });
            inst.open();
            assert.match( inst.test, /foo/ );
        });

        it('should be able to add function to \'onClose\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({
                onClose: function() {
                    this.test = "foo";
                }
            });
            inst.open().close();
            assert.match( inst.test, /foo/ );
        });

        it('should be able to add function to \'onChange\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select({
                onChange: function() {
                    this.test = "foo";
                }
            });
            inst.changeTo(2);
            assert.match( inst.test, /foo/ );
        });

    });

    describe('changeTo()', function () {

        it('should NOT change if index is less than 0', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.selectedOption(), 0 );
            inst.changeTo(-1);
            assert.equal( inst.selectedOption(), 0 );
        });

        it('should NOT change if index is greater than length of options', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.selectedOption(), 0 );
            inst.changeTo(6);
            assert.equal( inst.selectedOption(), 0 );
        });

        it('should NOT change if index is already selected', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.selectedOption(), 0 );
            inst.changeTo(0);
            assert.equal( inst.selectedOption(), 0 );
        });

        it('should remove attrs from previous option and add to current', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.changeTo(1);
            assert.isFalse( $(inst.options[0]).hasClass('is-selected') );
            assert.isTrue( $(inst.options[1]).hasClass('is-selected') );
            assert.match( $(inst.options[0]).attr('aria-selected'), /^false$/ );
            assert.match( $(inst.options[1]).attr('aria-selected'), /^true$/ );
        });

        it('should update the selected index of the source select element', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.source[0].selectedIndex, 0 );
            inst.changeTo(1);
            assert.equal( inst.source[0].selectedIndex, 1 );
        });

        it('should update the content of select to match that of the option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.select.html(), inst.options[0].innerHTML );
            inst.changeTo(1);
            assert.equal( inst.select.html(), inst.options[1].innerHTML );
        });

        it('should update aria-labelledby of select to id of selected option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.match( inst.select.attr('aria-labelledby'), /^select-option-0$/ );
            inst.changeTo(1);
            assert.match( inst.select.attr('aria-labelledby'), /^select-option-1$/ );
        });

        it('should trigger on change events attached to source select element', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select(), test = false;
            inst.source.on('change',function(){
                test = true;
            });
            assert.isFalse( test );
            inst.changeTo(1);
            assert.isTrue( test );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.changeTo( 1, function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('activeTo()', function () {

        it('should NOT change if index is less than 0', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.activeOption(), 0 );
            inst.activeTo(-1);
            assert.equal( inst.activeOption(), 0 );
        });

        it('should NOT change if index is greater than length of options', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.equal( inst.activeOption(), 0 );
            inst.activeTo(6);
            assert.equal( inst.activeOption(), 0 );
        });

        it('should remove attrs from previous option and add to current', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.activeTo(1);
            assert.isFalse( $(inst.options[0]).hasClass('is-active') );
            assert.isTrue( $(inst.options[1]).hasClass('is-active') );
        });

        it('should update \'aria-activedescendant\' attribute on menu and select', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.match( inst.select.attr('aria-activedescendant'), /^select-option-0$/ );
            assert.match( inst.menu.attr('aria-activedescendant'), /^select-option-0$/ );
            inst.activeTo(1);
            assert.match( inst.select.attr('aria-activedescendant'), /^select-option-1$/ );
            assert.match( inst.menu.attr('aria-activedescendant'), /^select-option-1$/ );
        });

    });

    describe('selectedOption()', function () {

        it('should return index of selected option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isNumber( inst.selectedOption() );
            assert.equal( inst.source[0].selectedIndex, inst.selectedOption() );
        });

    });

    describe('activeOption()', function () {

        it('should return index of active option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isNumber( inst.activeOption() );
            assert.equal( inst.activeOption(), 0 );
        });

    });

    describe('nextOption()', function () {

        it('should return index of next option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isNumber( inst.nextOption() );
            assert.equal( inst.nextOption(), 1 );
        });

        it('should NOT return index greater than length of list', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.activeTo(4);
            assert.isNumber( inst.nextOption() );
            assert.equal( inst.nextOption(), 4 );
        });

    });

    describe('prevOption()', function () {

        it('should return index of prev option', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.activeTo(2);
            assert.isNumber( inst.prevOption() );
            assert.equal( inst.prevOption(), 1 );
        });

        it('should NOT return index less than 0', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isNumber( inst.prevOption() );
            assert.equal( inst.prevOption(), 0 );
        });

    });

    describe('findOption()', function () {

        it('should return index of first option starting with matching integer', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isNumber( inst.findOption('2') );
            assert.equal( inst.findOption('2'), 1 );
        });

        it('should return index of first option starting with matching letter', function () {
            document.body.innerHTML = template.alpha;
            var inst = $('#select').select();
            assert.isNumber( inst.findOption('b') );
            assert.equal( inst.findOption('b'), 1 );
        });

    });

    describe('open()', function () {

        it('should update attributes of select and menu', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open();
            assert.match( inst.select.attr('aria-expanded'), /^true$/ );
            assert.match( inst.menu.attr('aria-hidden'), /^false$/ );
            assert.isTrue( inst.menu.hasClass('is-open') );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.open( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('close()', function () {

        it('should update attributes of select and menu', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open().close();
            assert.match( inst.select.attr('aria-expanded'), /^false$/ );
            assert.match( inst.menu.attr('aria-hidden'), /^true$/ );
            assert.isFalse( inst.menu.hasClass('is-open') );
        });

        it('should reset active index to match selected if they don\'t', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open().activeTo(2);
            assert.notEqual( inst.activeOption(), inst.selectedOption() );
            inst.close()
            assert.equal( inst.activeOption(), inst.selectedOption() );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open();
            inst.close( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('toggle()', function () {

        it('should open menu if it is closed', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isFalse( inst.isOpen() );
            inst.toggle();
            assert.isTrue( inst.isOpen() );
        });

        it('should close menu if it is open', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open();
            assert.isTrue( inst.isOpen() );
            inst.toggle();
            assert.isFalse( inst.isOpen() );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            inst.toggle( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('isOpen()', function () {

        it('should return true if menu is visible', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().open();
            assert.isTrue( inst.isOpen() );
        });

        it('should return false if menu is hidden', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select();
            assert.isFalse( inst.isOpen() );
        });

    });

    describe('setPosition()', function () {

        it('should set position with top and left styles', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().setPosition();
            assert.match( inst.menu[0].style.getPropertyValue('top'), /\d+(\.\d+)?px/ );
            assert.match( inst.menu[0].style.getPropertyValue('left'), /\d+(\.\d+)?px/ );
        });

    });

    describe('disable()', function () {

        it('should update attributes of the select', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().disable();
            assert.match( inst.select.attr('aria-disabled'), /^true$/ );
            assert.match( inst.select.attr('tabindex'), /^-1$/ );
            assert.isTrue( inst.select.hasClass('is-disabled') );
        });

        it('should update attribute of the source select', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().disable();
            assert.match( inst.source.attr('disabled'), /^disabled$/ );
        });

        it('should update \'disabled\' attribute of the instance', function () {
            document.body.innerHTML = template.default;
            var inst = $('#select').select().disable();
            assert.isTrue( inst.disabled );
        });

    });

    describe('enable()', function () {

        it('should update attributes of the select', function () {
            document.body.innerHTML = template.disabled;
            var inst = $('#select').select().enable();
            assert.match( inst.select.attr('aria-disabled'), /^false$/ );
            assert.match( inst.select.attr('tabindex'), /^0$/ );
            assert.isFalse( inst.select.hasClass('is-disabled') );
        });

        it('should update attribute of the source select', function () {
            document.body.innerHTML = template.disabled;
            var inst = $('#select').select().enable();
            assert.isFalse( inst.source[0].hasAttribute('disabled') );
        });

        it('should update \'disabled\' attribute of the instance', function () {
            document.body.innerHTML = template.disabled;
            var inst = $('#select').select().enable();
            assert.isFalse( inst.disabled );
        });

    });

});
