Boost JS Select Menu
==================================================
A style-free and accessible select menu plugin for jQuery and [Boost JS](https://github.com/marksmccann/boost-js). While other plugins style your select menu for you, this plugin only handles the functionality, leaving the layout styling up to you.


Installation
--------------------------------------
Install with npm:
```bash
npm install boost-js-select
```
Install in browser:
```html
<script src="https://cdn.rawgit.com/marksmccann/boost-js-select/v0.0.1/dist/select.min.js"></script>
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
activeClass | `"is-active"` | the class added to option in menu that is highlighted
openClass | `"is-open"` | the class added to menu when it is visible
selectedClass | `"is-selected"` | the class added to option that is selected
primaryClass | `"select"` | a string used to prefix classes for the select markup structure
disabledClass | `"select"` | the class added to select when disabled
matchedWidth | `false` | will set the width of the menu equal to the select
onOpen | `null` | a callback function called after the menu is made visible
onClose | `null` | a callback function called after the menu is hidden
onChange | `null` | a callback function called after a selection is changed
onInit | `null` | a callback function called after the select is initialized
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
<select id="select" data-matched-width="true">...</select>
```

### Classes
```html
<span class="[primaryClass] [disabledClass]">...</span>
<ul class="[primaryClass]-menu [openClass]">
    <li class="[primaryClass]-option [activeClass] [selectedClass]"></li>
    ...
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
instance.isVisible();
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
Compares the first character of each option's value against the alphanumeric character passed in and returns the index of the first match. Will return index of active option if no match is found.
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
Updates the selected option to the index passed in. `fn`: optional callback function called after change.
```javascript
instance.changeTo( 1 );
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