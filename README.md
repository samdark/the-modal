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
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
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

### Available options (default values)

```javascript
$.modal({
	/* css class of locked container(body) */
	lockClass: 'themodal-lock',

	/* css class of overlay */
	overlayClass: 'themodal-overlay',

	/* close modal on press ESC */
	closeOnEsc: true,

	/* close overlay when clicked on it */
	closeOnOverlayClick: true,

	/* callback function(overlay, localOptions){}, called before modal close,
	must be return bool(if true - close, if false - prevent closing) */
	onBeforeClose: null,

	/* callback function(overlay, localOptions){}, called after modal close */
	onClose: null,

	/* callback function(overlay, localOptions){}, called after modal open */
	onOpen: null,

	/* clone modal dom element on open or toggle it's visibility */
	cloning: true
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

License
-------

The Modal is a free software. It is released under the terms of the following BSD License.

Copyright © 2013 by Alexander Makarov
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of Alexander Makarov nor the names of project contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
