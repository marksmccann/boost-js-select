Boost JS Select Menu [![Build Status](https://travis-ci.org/marksmccann/boost-js-select.svg?branch=master)](https://travis-ci.org/marksmccann/boost-js-select)
==================================================
A style-free and accessible select menu plugin for jQuery and [Boost JS](https://github.com/marksmccann/boost-js). While other plugins style your select menu for you, this plugin only handles the functionality, leaving the layout and styling up to you.


Installation
--------------------------------------
Install with npm:
```bash
npm install boost-js-select
```
Install in browser:
```html
<script src="https://cdn.rawgit.com/marksmccann/boost-js-select/v0.0.3/dist/select.min.js"></script>
```

Usage
--------------------------------------

### Create Plugin
```javascript
var boost = require('boost-js');
// var boost = $.fn.boost; (browser install)

var select = require('boost-js-select');
// var select = $.fn.boost.select; (browser install)

$.fn.select = boost( select.plugin, select.defaults );
```

### Markup Structure
```html
<label for="select">...</label>
<select id="select">
    <option>1</option>
    <option>2</option>
    <option>3</option>
</select>
```

### Instantiate Plugin
```javascript
$('#select').select();
```

Options
--------------------------------------
Name | Default | Description
--- | --- | ---
activeClass<sup>1<sup> | `"is-active"` | the class added to option in menu that is highlighted
openClass<sup>1<sup> | `"is-open"` | the class added to menu when it is visible
selectedClass<sup>1<sup> | `"is-selected"` | the class added to option that is selected
primaryClass<sup>1<sup> | `"select"` | a string used to create classes for the markup structure.
disabledClass<sup>1<sup> | `"is-disabled"` | the class added to select when disabled
matchWidth | `false` | will set the width of the menu equal to the select
onOpen | `null` | a callback function called after the menu is made visible
onClose | `null` | a callback function called after the menu is hidden
onChange | `null` | a callback function called after a selection is made
onInit | `null` | a callback function called after the select is initialized
*1. See the "Class Placement" section below for a guide on where these classes are placed on the rendered markup.*
### Usage
```javascript
$('#tooltip').tooltip({
    onInit: function() {
        console.log( this.id ); // 'select'
    }
});
```
\- or -
```html
<select id="select" data-match-width="true">...</select>
```

### Class Placement
```html
<span class="[primaryClass] [disabledClass]">...</span>
<ul class="[primaryClass]-menu [openClass]">
    <li class="[primaryClass]-option [activeClass] [selectedClass]"></li>
</ul>
```

API
--------------------------------------
### open( fn )
Opens the option menu. `fn`: optional callback function called after opening.
```javascript
instance.open();
```
### close( fn )
Closes the option menu. `fn`: optional callback function called after closing.
```javascript
instance.close();
```
### isOpen()
Determines if them menu is open and visible or not. Returns boolean.
```javascript
instance.isOpen(); // false
```
### toggle( fn )
Closes the menu if it is open and vice versa. `fn`: optional callback function.
```javascript
instance.toggle();
```
### setPosition()
Calculates the sets the top/left position for the menu relative to the bottom left-hand corner of the select.
```javascript
instance.setPosition();
```
### disable()
Disables the select.
```javascript
instance.disable();
```
### enable()
Enables a disabled select.
```javascript
instance.enable();
```
### findOption( char )
Compares the first character of each option's html content against the character passed in and returns the index of the first match. Will return index of active option if no match is found.
```javascript
instance.findOption( 'a' );
```
### prevOption()
Returns the index of the previous option relative to the active one.
```javascript
instance.prevOption();
```
### nextOption()
Returns the index of the next option relative to the active one.
```javascript
instance.nextOption();
```
### activeOption()
Retrieves the index of the active/highlighted option.
```javascript
instance.activeOption();
```
### selectedOption()
Retrieves the index of the of the selected option.
```javascript
instance.selectedOption();
```
### activeTo( int )
Updates the active/highlighted option to the index passed in.
```javascript
instance.activeTo( 1 );
```
### changeTo( int, fn )
Updates the selected option to the index passed in. `fn`: optional callback function called after change. Will also trigger any change events assigned to the original select element.
```javascript
instance.changeTo( 1 );
```
### select
The new, customizable "select" element.
```javascript
instance.select;
```
### menu
The new, customizable dropdown menu element for the select.
```javascript
instance.menu;
```
### options
The set of new, customizable "option" elements that are direct descendants of the menu.
```javascript
instance.options;
```
### label
The label associated with the select.
```javascript
instance.label;
```
### disabled
A boolean value which store the disabled state of the select.
```javascript
instance.disabled; // false
```

Running Tests
--------------------------------------

```bash
$ npm install && npm test
```


License
--------------------------------------

Copyright © 2016, [Mark McCann](https://github.com/marksmccann).
Released under the [MIT license](LICENSE).
