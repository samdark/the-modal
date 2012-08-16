The Modal
=========

The goal of this jQuery plugin is to implement modal boxes.

If the box is modal then:

- Page itself should not be scrollable.
- Modal box content should be scrollable independent of the page.

Facebook and vk.com photo modals are working like that and I think
it's the right way to go.

Before describing features and API here's [the demo](http://rmcreative.ru/playground/modals_plugin/demo.html).

Features
--------

- No extra markup required.
- You can use it w/o markup at all by opening empty modal and filling it with
  custom data the way you want (see below).
- Optional close on ESC (enabled by default).

More to come.

Usage
-----

In order to use this plugin you need the following in the `head` section of your HTML:

```html
<script type="text/javascript" src="jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="jquery.the-modal.js"></script>
<link rel="stylesheet" type="text/css" href="the-modal.css" media="all" />
```

### HTML-markup as modal content

HTML:

```html
<div class="modal" id="terms-of-service" style="display: none">
		<a href="#" class="close">×</a>

		Terms of service here
</div>
```

JavaScript:

```javascript
// attach close button handler
$('.modal .close').on('click', function(e){
	e.preventDefault();
	$.modal().close();
});

// open modal with default options or options set with init
// content will be taken from #login
$('#terms-of-service').modal().open();

// also we can open modal overriding some default options
$('#terms-of-service').modal().open({
	closeOnESC: false
});

// Close modal. There's no need to choose which one since only one can be opened
$.modal().close();
```

### Custom content

```javascript
$.modal().open({
	onOpen: function(el, options){
		el.html('Hello!');
	}
});
```

### AJAX-content

```javascript
$.modal().open({
	onOpen: function(el, options){
		$.get('http://example.com/', function(data){
			el.html(data);
		});
	}
});
```

### Overriding options

```javascript
// set option as default for all modals opened
$.modal({
	closeOnESC: true
});

// set some default options for specific dom element
$('#login').modal({
	closeOnESC: true,
	onClose: function(el, options) {
		alert('Closed!');
	}
});
```

Known issues to be fixed
------------------------

- FF scrolls page instead of modal content when pressing cursor keys and PGUP,
  PGDWN. If content of the modal is clicked once, it works fine.
- After scrolling down all modal content iOS Safari is starting scrolling page content.