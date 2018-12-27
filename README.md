# jQuery.Poseidon
Lightweight jQuery AJAX plugin and API client

## Overview
The jQuery Poseidon plugin allows you to easily submit forms via AJAX, make API requests and even render templates on the fly. The main method, Poseidon, gathers information from the form element to determine how to manage the form submit process.
```javascript
$.poseidon('form', {
	onSucess() {
		alert('Form submitted!');
	}
});
```

### Making API requests:
```javascript
// Make a POST request to an API endpoint
$.poseidon.request('https://reqres.in/api/users');

// Make a GET request to an API endpoint
$.poseidon.default.method = 'GET';
$.poseidon.request('https://reqres.in/api/users');

// Make a GET request to an API endpoint with authentication
$.poseidon.default.method = 'GET'; // Set the request type

// Warning: API keys aren't meant to be exposed on the client, you should only 
// use this on the backend e.g NodeJS
$.poseidon.default.headers = {
	'X-API-KEY': '910091092129ABRJS'
};

// Make request
$.poseidon.request('https://reqres.in/api/users');

// Output
{  
   "page":1,
   "per_page":3,
   "total":12,
   "total_pages":4,
   "data":[  
      {  
         "id":1,
         "first_name":"George",
         "last_name":"Bluth",
         "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
      },
      {  
         "id":2,
         "first_name":"Janet",
         "last_name":"Weaver",
         "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
      },
      {  
         "id":3,
         "first_name":"Emma",
         "last_name":"Wong",
         "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
      }
   ]
}
```

### Rendering data to a template:
```javascript
// HTML markup with template literals in mustache brackets
const template = '<div>Hello {{ name }}</div>'; // Could also be $('template').html();

// Data to replace with template literals
const data = {
	name: 'DanielTheGeek'
};

// Store the rendered template to a var so we can append later
const renderedTemplate = $.poseidon.render(template, data);

// Append rendered template to a DOM element
$('.target').append( renderedTemplate );
```

### Rendering API payload to a template
```javascript
// Markup
<div id="users"></div>
<script id="users-list-template" type="text/x-poseidon-template">
	<div class="user">
		<div class="image">
			<img src="{{ avatar }}">
		</div>
		<div>{{ first_name }} {{ last_name }}</div>
	</div>
</script>

// In your JavaScript file
$.poseidon.default.method = 'GET';
$.poseidon.request('https://reqres.in/api/users', {
	onSuccess(data) {
		const template = $('#users-list-template').html();
		
		$.each(data.data, function(index, value) {
			const render = $.poseidon.render(template, value);
			$('#users').append(render);
		});
	}
});
```

## Contributing
With your help, this plugin can be improved and nice features can be added quickly. To contribute:
```
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
```

## Compatibility
* Requires jQuery 1.7.2 or later.  
* Compatible with jQuery 2.
* Compatible with jQuery 3.

### Download
## Yarn
```bash
yarn add jquery.poseidon
```
## NPM
```bash
npm i jquery.poseidon
```
## Git
```bash
git clone https://github.com/danielthegeek/jquery.poseidon.git
```

### CDN
Coming soon
---

## API
Coming soon

## License
This project is licensed under the MIT license:
* [MIT](LICENSE-MIT)
