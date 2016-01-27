/**
 * The Modal jQuery plugin
 *
 * @author Alexander Makarov <sam@rmcreative.ru>
 * @link https://github.com/samdark/the-modal
 * @version 0.0.14
 */
;(function($, window, document, undefined) {
	"use strict";
	/*jshint smarttabs:true*/

	// :focusable expression, needed for tabindexes in modal
	$.extend($.expr[':'],{
		focusable: function(element){
			var map, mapName, img,
				nodeName = element.nodeName.toLowerCase(),
				isTabIndexNotNaN = !isNaN($.attr(element,'tabindex'));
			if ('area' === nodeName) {
				map = element.parentNode;
				mapName = map.name;
				if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
					return false;
				}
				img = $('img[usemap=#' + mapName + ']')[0];
				return !!img && visible(img);
			}

			var result = isTabIndexNotNaN;
			if (/input|select|textarea|button|object/.test(nodeName)) {
				result = !element.disabled;
			} else if ('a' === nodeName) {
				result = element.href || isTabIndexNotNaN;
			}

			return result && visible(element);

			function visible(element) {
				return $.expr.filters.visible(element) &&
					!$(element).parents().addBack().filter(function() {
						return $.css(this,'visibility') === 'hidden';
					}).length;
			}
		}
	});

	var pluginNamespace = 'the-modal',
		// global defaults
		defaults = {
			lockClass: 'themodal-lock',
			overlayClass: 'themodal-overlay',

			closeOnEsc: true,
			closeOnOverlayClick: true,

			onBeforeClose: null,
			onClose: null,
			onOpen: null,

			cloning: true
		};
	var oMargin = {};
	var ieBodyTopMargin = 0;

	function isIE() {
		return ((navigator.appName == 'Microsoft Internet Explorer') ||
			(navigator.userAgent.match(/MSIE\s+\d+\.\d+/)) ||
			(navigator.userAgent.match(/Trident\/\d+\.\d+/)));
	}

	function lockContainer(options, overlay) {
		var body = $('body');
		var oWidth = body.outerWidth(true);
		body.addClass(options.lockClass);
		var sbWidth = body.outerWidth(true) - oWidth;
		if (isIE()) {
			ieBodyTopMargin = body.css('margin-top');
			body.css('margin-top', 0);
		}

		if (sbWidth != 0) {
			var tags = $('html, body');
			tags.each(function () {
				var $this = $(this);
				oMargin[$this.prop('tagName').toLowerCase()] = parseInt($this.css('margin-right'));
			});
			$('html').css('margin-right', oMargin['html'] + sbWidth);
			overlay.css('left', 0 - sbWidth);
		}
	}

	function unlockContainer(options) {
		if (isIE()) {
			$('body').css('margin-top', ieBodyTopMargin);
		}

		var body = $('body');
		var oWidth = body.outerWidth(true);
		body.removeClass(options.lockClass);
		var sbWidth = body.outerWidth(true) - oWidth;

		if (sbWidth != 0) {
			$('html, body').each(function () {
				var $this = $(this);
				$this.css('margin-right', oMargin[$this.prop('tagName').toLowerCase()])
			});
		}
	}

	function init(els, options) {
		var modalOptions = options;

		if(els.length) {
			els.each(function(){
				$(this).data(pluginNamespace+'.options', modalOptions);
			});
		} else {
			$.extend(defaults, modalOptions);
		}

		// on Ctrl+A click fire `onSelectAll` event
		$(window).bind('keydown',function(e){
			if (!(e.ctrlKey && e.keyCode == 65)) {
				return true;
			}

			if ( $('input:focus, textarea:focus').length > 0 ) {
			    return true;
			}

			var selectAllEvent = new $.Event('onSelectAll');
			selectAllEvent.parentEvent = e;
			$(window).trigger(selectAllEvent);
			return true;
		});

		els.bind('keydown',function(e){
			var modalFocusableElements = $(':focusable',$(this));
			if(modalFocusableElements.filter(':last').is(':focus') && (e.which || e.keyCode) == 9){
				e.preventDefault();
				modalFocusableElements.filter(':first').focus();
			}
		});

		return {
			open: function(options) {
				var el = els.get(0),
					localOptions = $.extend({}, defaults, $(el).data(pluginNamespace+'.options'), options);

				// close modal if opened
				if($('.'+localOptions.overlayClass).length) {
					$.modal().close();
				}

				var overlay = $('<div/>').addClass(localOptions.overlayClass).prependTo('body');
				overlay.data(pluginNamespace+'.options', localOptions);

				lockContainer(localOptions, overlay);

				if(el) {
					var openedModalElement = null;
					if (!localOptions.cloning) {
						overlay.data(pluginNamespace+'.el', el);
						$(el).data(pluginNamespace+'.parent', $(el).parent());
						openedModalElement = $(el).appendTo(overlay).show();
					} else {
						openedModalElement = $(el).clone(true).appendTo(overlay).show();
					}
				}

				if(localOptions.closeOnEsc) {
					$(document).bind('keyup.'+pluginNamespace, function(e){
						if(e.keyCode === 27) {
							$.modal().close(localOptions);
						}
					});
				}

				if(localOptions.closeOnOverlayClick) {
					$('.' + localOptions.overlayClass).on('click.' + pluginNamespace, function(e){
						if (e.target.className == localOptions.overlayClass){
							$.modal().close();
						}
					});
				}

				$(document).bind('touchmove.'+pluginNamespace,function(e){
					if(!$(e).parents('.' + localOptions.overlayClass)) {
						e.preventDefault();
					}
				});

				if(el) {
					$(window).bind('onSelectAll',function(e){
						e.parentEvent.preventDefault();

						var range = null,
							selection = null,
							selectionElement = openedModalElement.get(0);
						if (document.body.createTextRange) { //ms
							range = document.body.createTextRange();
							range.moveToElementText(selectionElement);
							range.select();
						} else if (window.getSelection) { //all others
							selection = window.getSelection();
							range = document.createRange();
							range.selectNodeContents(selectionElement);
							selection.removeAllRanges();
							selection.addRange(range);
						}
					});
				}

				if(localOptions.onOpen) {
					localOptions.onOpen(overlay, localOptions);
				}
			},
			close: function(options) {
				var el = els.get(0),
				  localOptions = $.extend({}, defaults, $(el).data(pluginNamespace+'.options'), options);
				var overlay = $('.' + localOptions.overlayClass);

				if ($.isFunction(localOptions.onBeforeClose)) {
					if (localOptions.onBeforeClose(overlay, localOptions) === false) {
						return;
					}
				}

				if (!localOptions.cloning) {
					if (!el) {
						el = overlay.data(pluginNamespace+'.el');
					}
					$(el).hide().appendTo($(el).data(pluginNamespace+'.parent'));
				}

				overlay.remove();
				unlockContainer(localOptions);

				if(localOptions.closeOnEsc) {
					$(document).unbind('keyup.'+pluginNamespace);
				}

				$(window).unbind('onSelectAll');

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
