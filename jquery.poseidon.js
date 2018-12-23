/**
* Powerful jQuery AJAX plugin
* Author: Daniel Omoniyi www.github.com/danielthegeek
*/
(function($) {
	$.fn.poseidon = function(options) {
		// Aggregate settings
		var settings = $.extend({}, $.fn.poseidon.defaults, options);

		// Init
		this.initialize = function() {
			// Prevent default form action
			$(this).submit(function(e) {
				e.preventDefault();
			});

			attachDataAttrs(this);

			return this.each(function(){
				var data = settings.data;
				if ( settings.method.toLowerCase() == 'form_post' ) {
					var button = $('[data-poseidon-button]');
					var buttonText = button.text();
					data = $(this).serialize();
				}

				$.ajax({
					url: $(this).attr('action'),
					type: settings.method,
					data: data,
					dataType: settings.dataType,
					cache: settings.cache,
					beforeSend: function() {
						button.text('processing...');
					},
					success: function(data) {	
						button.text(buttonText);
						$('[data-poseidon-target]').html( data );
						settings.onSuccess.call(data);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						button.text(buttonText);
						settings.onError.call(XMLHttpRequest, textStatus, errorThrown);
				    }
				});
			});
		}

		var attachDataAttrs = function(elem) {
			$(elem).attr('data-poseidon', '');
			$(elem).find('button').attr('data-poseidon-button', '');
			$(elem).find('input[type=submit]').attr('data-poseidon-button', '');
		}

		return this.initialize();
	}

	$.fn.poseidon.defaults = {
		method: 'post',
		data: '',
		preloader: '',
		cache: false,
		dataType: 'json',
		pollInterval: 0, 
		onBeforeSend: function() {},
		onSuccess: function() {},
		onError: function() {},
	};

	$.fn.poseidon.request = function(endpoint, options) {
		// Aggregate settings
		var settings = $.extend({}, $.fn.poseidon.defaults, options);

		makeRequest(endpoint, settings);

		var makeRequest = function(endpoint, settings) {
			// Ajaxify
			$.ajax({
				url: endpoint,
				type: settings.method,
				data: settings.data,
				dataType: settings.dataType,
				cache: settings.cache,
				beforeSend: function() {
					settings.onBeforeSend.call();
				},
				success: function(data) {	
					settings.onSuccess.call(data);
					
					if (settings.pollInterval > 0) {
						setTimeout(function() {
							makeRequest(endpoint, settings);
						}, settings.pollInterval);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					settings.onError.call(XMLHttpRequest, textStatus, errorThrown);
			    }
			});
		}
	}
})(jQuery);