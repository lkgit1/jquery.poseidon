/**
* Powerful jQuery AJAX plugin
* Author: Daniel Omoniyi www.github.com/danielthegeek
*/
(function($) {
	$.extend({
        poseidon: function(elem, options) {
        	let form = $(elem);
			let settings = getSettings(options); // Aggregate settings

			let attachDataAttrs = function(elem) {
				$(elem).attr('data-poseidon', '');
				$(elem).find('button').attr('data-poseidon-button', '');
				$(elem).find('input[type=submit]').attr('data-poseidon-button', '');
			}

			form.request = function(endpoint, settings){
				return $.poseidon.request(endpoint, settings);
			};
			
			// Init
			form.initialize = function() {
				if ( form.is('form') ) {
					return form.each(function(){
						// Prevent default form action
						form.submit(function(e) {
							e.preventDefault();
						});

						attachDataAttrs(form);

						let data = settings.data, button = $('[data-poseidon-button]'),
						buttonText = button.text();

						if ( settings.data == '' ) {
							data = $(form).serialize();
						}

						$.ajax({
							url: $(form).attr('action'),
							type: settings.method,
							data: data,
							dataType: settings.dataType,
							cache: settings.cache,
							beforeSend() {
								button.text('processing...');
								callback(settings.onBeforeSend).fire();
							},
							success(data, textStatus, jqXHR) {	
								button.text(buttonText);
								$('[data-poseidon-target]').html(data);
								
								callback(settings.onSuccess).fire(data, textStatus, jqXHR);
							},
							error(XMLHttpRequest, textStatus, errorThrown) {
								button.text(buttonText);
								callback(settings.onError).fire(XMLHttpRequest, textStatus, errorThrown);
						    }
						});
					});			
				} else {
					console.error('<' + elem + '> is not a valid form element');
				}
			}

			return form.initialize();
		}
    });

	$.poseidon.default = {
		method: 'post',
		data: '',
		preloader: '',
		cache: false,
		dataType: 'json',
		pollInterval: 0,
		headers: {},
		onBeforeSend: function() {},
		onSuccess: function() {},
		onError: function() {},
	}

	const getSettings = function(options) {
		return $.extend(true, {}, $.poseidon.default, options);
	}

	const callback = function(callback) {
		let call = $.Callbacks().add(callback);

		return call;
	}

	const request = function(endpoint, settings) {
		// Ajaxify
		return $.ajax({
			url: endpoint,
			type: settings.method,
			data: settings.data,
			dataType: settings.dataType,
			cache: settings.cache,
			headers: settings.headers,
			beforeSend(){
				callback(settings.onBeforeSend).fire();
			},
			success(data, textStatus, jqXHR) {					
				callback(settings.onSuccess).fire(data, textStatus, jqXHR);

				if (settings.pollInterval > 0) {
					setTimeout(function() {
						makeRequest(endpoint, settings);
					}, settings.pollInterval);
				}
			},
			error(XMLHttpRequest, textStatus, errorThrown) {
				callback(settings.onError).fire(XMLHttpRequest, textStatus, errorThrown);
		    }
		});
	}

	const parse = function(template) {
	    return function(o) {
	        return template.replace(/{{([^{}]*)}}/g, function (a, b) {
	        	let str = b.replace(/\s/g, '');
	            let r = o[str];

	            if (typeof r == 'string' || typeof r == 'number') {
	            	return r;
	            } else {
					let arr = str.split('.', 2);
					let key = arr[0], value = arr[1];
	            	
	            	if (key !== undefined && value !== undefined) {
	            		r = o[key];
	            		
	            		console.error(`Array ${key}: The template parser does not support arrays yet.`);
	            	}

	            	return '';
	            }
	        });
	    }
	}

    $.poseidon.request = function(endpoint, options) {
		// Aggregate settings
		let settings = getSettings(options);

		return request(endpoint, settings);
	}

	$.poseidon.render = function(template, data){
		return parse(template)(data);
	}
})(jQuery);