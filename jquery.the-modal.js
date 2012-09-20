/**
 * The Modal jQuery plugin
 *
 * @author Alexander Makarov <sam@rmcreative.ru>
 * @link https://github.com/samdark/the-modal
 * @version 1.0
 */
;(function($, window, document, undefined) {
	"use strict";
	/*jshint smarttabs:true*/

	var pluginNamespace = 'the-modal',
		// global defaults
    	defaults = {
			overlayClass: 'themodal-overlay',

			closeOnEsc: true,
			closeOnOverlayClick: true,

			onClose: null,
			onOpen: null
        };

	function getContainer() {
		var container = 'body';

		// IE < 8
		if(document.all && !document.querySelector) {
			container = 'html';
		}

		return $(container);
	}

	function init(els, options) {
		var modalOptions = options;

		if(els.length) {
			els.each(function(){
				$(this).data(pluginNamespace+'.options', modalOptions);
			});
		}
		else {
			$.extend(defaults, modalOptions);
		}

		return {
			open: function(options) {
				var el = els.get(0);
				var localOptions = $.extend({}, defaults, $(el).data(pluginNamespace+'.options'), options);

				getContainer().addClass('lock');

				// close modal if opened
				if($('.'+localOptions.overlayClass).length) {
					$.modal().close();
				}

				var overlay = $('<div/>').addClass(localOptions.overlayClass).prependTo('body');
				overlay.data(pluginNamespace+'.options', options);

				if(el) {
					$(el).clone(true).appendTo(overlay).show();
				}

				if(localOptions.closeOnEsc) {
					$(document).bind('keyup.'+pluginNamespace, function(e){
						if(e.keyCode === 27) {
							$.modal().close();
						}
					});
				}

				if(localOptions.closeOnOverlayClick) {
					overlay.children().on('click.' + pluginNamespace, function(e){
						e.stopPropagation();
					});
					$('.' + localOptions.overlayClass).on('click.' + pluginNamespace, function(e){
						$.modal().close();
					});
				}

				$(document).bind('touchmove.'+pluginNamespace,function(e){
					if(!$(e).parents('.' + localOptions.overlayClass)) {
						e.preventDefault();
					}
				});

				if(localOptions.onOpen) {
					localOptions.onOpen(overlay, localOptions);
				}
			},
			close: function() {
				var el = els.get(0);

				var localOptions = $.extend({}, defaults, options);
				var overlay = $('.' + localOptions.overlayClass);
				$.extend(localOptions, overlay.data(pluginNamespace+'.options'));

				overlay.remove();
				getContainer().removeClass('lock');

				if(localOptions.closeOnEsc) {
					$(document).unbind('keyup.'+pluginNamespace);
				}

				if(localOptions.onClose) {
					localOptions.onClose(overlay, localOptions);
				}
			}
		};
	}

	$.modal = function(options){
		return init($(), options);
	};

	$.fn.modal = function(options) {
		return init(this, options);
	};

})(jQuery, window, document);