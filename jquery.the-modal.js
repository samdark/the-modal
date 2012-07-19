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
			closeOnEsc: true,
			//closeOnShimClick: false,

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
				// close modal if opened
				$.modal().close();

				var el = els.get(0);
				var localOptions = $.extend({}, defaults, $(el).data(pluginNamespace+'.options'), options);

				getContainer().addClass('lock');

				var modal = $('<div class="shim" />').prependTo('body');

				if(el) {
					var cln = $(el).clone(true).appendTo(modal).show();
				}

				if(localOptions.closeOnEsc) {
					$(document).bind('keyup.'+pluginNamespace, function(e){
						if(e.keyCode === 27) {
							$.modal().close();
						}
					});
				}

				$(document).bind("touchmove",function(e){
					if(!$(e).parents('.shim')) {
						e.preventDefault();
					}
				});

				if(localOptions.closeOnShimClick) {
					$('body').bind('click.'+pluginNamespace, function(e){
						console.debug('shim');
					});
				}

				if(localOptions.onOpen) {
					localOptions.onOpen(cln, localOptions);
				}
			},
			close: function() {
				var shim = $('.shim');
				var el = shim.children().get(0);
				var localOptions = $.extend({}, defaults, $(el).data(), options);

				shim.remove();

				getContainer().removeClass('lock');

				if(localOptions.closeOnEsc) {
					$(document).unbind('keyup.'+pluginNamespace);
				}

				if(localOptions.onClose) {
					localOptions.onClose(el, localOptions);
				}
			}
		};
	}

	$.modal = function(options){
		return init($, options);
	};

	$.fn.modal = function(options) {
		return init(this, options);
	};

})(jQuery, window, document);