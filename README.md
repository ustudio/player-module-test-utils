# player-module-test-utils #

Utilities for writing unit tests against uStudio Player Modules.

## Installation ##

This module may be used by installing it from the Github repository:

```
npm install -D 'git+https://github.com/ustudio/player-module-test-utils.git'
```

## Usage ##

The module is intended to be `require`d by tests via Browserify,
although other concatenators that support node modules and ES6 may
work.

You need to `require` the harness before you `require` your module
under test.

```javascript
let moduleHarness = require('player-module-test-utils/module_harness');

require('../src/my-module.js');
```

### Module Registration ###

Modules that register themselves will be stored in the
`registeredModules` array:

```javascript
console.log(moduleHarness.registeredModules);

// [{
//  callback: function() {},
//  configuration:
//  {
//    raw configuration passed to registerModule...
//  },
//  moduleName: "MyModule"
// }]
```

### Module Initialization ###

Modules may be initialized by calling `initializeModule`, passing in
the module name and configuration, an event bus and the videos. If the
module initializes itself asynchronously, a callback can be provided,
which will be called when the module finishes initializing.

```javascript
moduleHarness.initializeModule('MyModule', {my_config: 'values'}, eventBus, videos);
```

Assuming your module's `initialize` function is idempotent, you can
call this method in every test, or in your `setUp`/`beforeEach`.

### MockEvents ###

A mock event bus is provided, which provides the same API as the
uStudio Player Framework event bus, with the added feature that it
logs all events broadcast, so that tests can assert particular events
are broadcast.

```javascript
let events = new moduleHarness.MockEvents();

events.subscribe('some-event', () => {console.log('Event received!');});

events.broadcast('some-event', ['arg1', 'arg2']);

// Output: Event received!

// assumes Chai expect is required as a global variable.
events.assertEventBroadcastOnceWith('some-event', ['arg1', 'arg2']);

// Alternately, you can access the raw events:
console.log(events.events);

// Output: {'some-event': [['arg1', 'arg2']]}

// You can also clear the list of events:
events.clearLoggedEvents();
```
