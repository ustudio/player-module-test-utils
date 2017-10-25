let registeredModules = [];

window.uStudio = {
  uStudioCore: {
    instance: {
      registerModule: function(parameters) {
        registeredModules.push({
          callback: parameters.initialize,
          configuration: parameters,
          moduleName: parameters.name
        });
      }
    }
  }
};

function initializeModule(name, config, bus, videos, callback) {
  for (const i in registeredModules) {
    const module = registeredModules[i];

    if (module.moduleName === name) {
      module.callback(config, bus, videos, callback);
      return;
    }
  }

  throw new Error(`No module named ${name}`);
}

class MockEvents {
  constructor() {
    this.subscriptions = {};
    this.events = {};
  }

  subscribe(event, fn, context) {
    if (this.subscriptions.hasOwnProperty(event)) {
      this.subscriptions[event].push([fn, context]);
    }
    else {
      this.subscriptions[event] = [[fn, context]];
    }
  }

  broadcast(event, args) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }
    this.events[event].push(args);

    if (this.subscriptions.hasOwnProperty(event)) {
      this.subscriptions[event].forEach((subscription) => {
        subscription[0].apply(subscription[1], args);
      });
    }
  }

  assertEventBroadcastOnceWith(event, allArgs) {
    expect(this.events[event]).to.deep.equal([allArgs]);
  }

  clearLoggedEvents() {
    this.events = {};
  }
}

export {
  registeredModules,
  initializeModule,
  MockEvents
};
