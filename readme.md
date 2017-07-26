# can-model-queue

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-model-queue.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/canjs/can-model-queue.png?branch=master)](https://travis-ci.org/canjs/can-model-queue)

Queued requests to the server.

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-model-queue';
```

### CommonJS use

Use `require` to load `can-model-queue` and everything else
needed to create a template that uses `can-model-queue`:

```js
var plugin = require("can-model-queue");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-model-queue` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-model-queue',
		    	location: 'node_modules/can-model-queue/dist/amd',
		    	main: 'lib/can-model-queue'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-model-queue/dist/global/can-model-queue.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
