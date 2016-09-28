Router = FineRouter.Router;

Tinytest.addAsync('Client - Router - define and go to route', function (test, next) {
  var rand = Random.id();
  var rendered = 0;

  FineRouter.route('/' + rand, {
    action: function(_params) {
      rendered++;
    }
  });

  FineRouter.go('/' + rand);

  setTimeout(function() {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - define and go to route with fields',
function (test, next) {
  var rand = Random.id();
  var pathDef = "/" + rand + "/:key";
  var rendered = 0;

  FineRouter.route(pathDef, {
    action: function(params) {
      test.equal(params.key, "abc +@%");
      rendered++;
    }
  });

  FineRouter.go(pathDef, {key: "abc +@%"});

  setTimeout(function() {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - parse params and query', function (test, next) {
  var rand = Random.id();
  var rendered = 0;
  var params = null;

  FineRouter.route('/' + rand + '/:foo', {
    action: function(_params) {
      rendered++;
      params = _params;
    }
  });

  FineRouter.go('/' + rand + '/bar');

  setTimeout(function() {
    test.equal(rendered, 1);
    test.equal(params.foo, 'bar');
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - redirect using FineRouter.go', function (test, next) {
  var rand = Random.id(), rand2 = Random.id();
  var log = [];
  var paths = ['/' + rand2, '/' + rand];
  var done = false;

  FineRouter.route(paths[0], {
    action: function(_params) {
      log.push(1);
      FineRouter.go(paths[1]);
    }
  });

  FineRouter.route(paths[1], {
    action: function(_params) {
      log.push(2);
    }
  });

  FineRouter.go(paths[0]);

  setTimeout(function() {
    test.equal(log, [1, 2]);
    done = true;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - get current route path', function (test, next) {
  var value = Random.id();
  var randomValue = Random.id();
  var pathDef = "/" + randomValue + '/:_id';
  var path = "/" + randomValue + "/" + value;

  var detectedValue = null;

  FineRouter.route(pathDef, {
    action: function(params) {
      detectedValue = params._id;
    }
  });

  FineRouter.go(path);

  Meteor.setTimeout(function() {
    test.equal(detectedValue, value);
    test.equal(FineRouter.current().path, path);
    next();
  }, 50);
});

Tinytest.addAsync('Client - Router - subscribe to global subs', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand);

  FineRouter.subscriptions = function (path) {
    test.equal(path, '/' + rand);
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!!GetSub('baz'));
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - setParams - generic', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "/:cat/:id";
  var paramsList = [];
  FineRouter.route(pathDef, {
    action: function(params) {
      paramsList.push(params);
    }
  });

  FineRouter.go(pathDef, {cat: "meteor", id: "200"});
  setTimeout(function() {
    // return done();
    var success = FineRouter.setParams({id: "700"});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(paramsList.length, 2);
    test.equal(_.pick(paramsList[0], "id", "cat"), {cat: "meteor", id: "200"});
    test.equal(_.pick(paramsList[1], "id", "cat"), {cat: "meteor", id: "700"});
    done();
  }
});

Tinytest.addAsync('Client - Router - setParams - preserve query strings', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "/:cat/:id";
  var paramsList = [];
  var queryParamsList = [];

  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      paramsList.push(params);
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {cat: "meteor", id: "200 +% / ad"}, {aa: "20 +%"});
  setTimeout(function() {
    // return done();
    var success = FineRouter.setParams({id: "700 +% / ad"});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(paramsList.length, 2);
    test.equal(queryParamsList.length, 2);

    test.equal(_.pick(paramsList[0], "id", "cat"), {cat: "meteor", id: "200 +% / ad"});
    test.equal(_.pick(paramsList[1], "id", "cat"), {cat: "meteor", id: "700 +% / ad"});
    test.equal(queryParamsList, [{aa: "20 +%"}, {aa: "20 +%"}]);
    done();
  }
});

Tinytest.add('Client - Router - setParams - no route selected', function (test) {
  var originalRoute = FineRouter._current.route;
  FineRouter._current.route = undefined;
  var success = FineRouter.setParams({id: "800"});
  test.isFalse(success);
  FineRouter._current.route = originalRoute;
});

Tinytest.addAsync('Client - Router - setQueryParams - using check', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "";
  var queryParamsList = [];
  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {}, {cat: "meteor", id: "200"});
  setTimeout(function() {
    check(FineRouter.current().queryParams, {cat: String, id: String});
    done();
  }, 50);
});

Tinytest.addAsync('Client - Router - setQueryParams - generic', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "";
  var queryParamsList = [];
  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {}, {cat: "meteor", id: "200"});
  setTimeout(function() {
    // return done();
    var success = FineRouter.setQueryParams({id: "700"});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0], "id", "cat"), {cat: "meteor", id: "200"});
    test.equal(_.pick(queryParamsList[1], "id", "cat"), {cat: "meteor", id: "700"});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - remove query param null', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "";
  var queryParamsList = [];
  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {}, {cat: "meteor", id: "200"});
  setTimeout(function() {
    var success = FineRouter.setQueryParams({id: "700", cat: null});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0], "id", "cat"), {cat: "meteor", id: "200"});
    test.equal(queryParamsList[1], {id: "700"});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - remove query param undefined', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "";
  var queryParamsList = [];
  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {}, {cat: "meteor", id: "200"});
  setTimeout(function() {
    var success = FineRouter.setQueryParams({id: "700", cat: undefined});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0], "id", "cat"), {cat: "meteor", id: "200"});
    test.equal(queryParamsList[1], {id: "700"});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - preserve params', function (test, done) {
  var randomKey = Random.id();
  var pathDef = "/" + randomKey + "/:abc";
  var queryParamsList = [];
  var paramsList = [];
  FineRouter.route(pathDef, {
    action: function(params, queryParams) {
      paramsList.push(params);
      queryParamsList.push(queryParams);
    }
  });

  FineRouter.go(pathDef, {abc: "20"}, {cat: "meteor", id: "200"});
  setTimeout(function() {
    // return done();
    var success = FineRouter.setQueryParams({id: "700"});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(queryParamsList, [
      {cat: "meteor", id: "200"}, {cat: "meteor", id: "700"}
    ]);

    test.equal(paramsList.length, 2);
    test.equal(_.pick(paramsList[0], "abc"), {abc: "20"});
    test.equal(_.pick(paramsList[1], "abc"), {abc: "20"});
    done();
  }
});

Tinytest.add('Client - Router - setQueryParams - no route selected', function (test) {
  var originalRoute = FineRouter._current.route;
  FineRouter._current.route = undefined;
  var success = FineRouter.setQueryParams({id: "800"});
  test.isFalse(success);
  FineRouter._current.route = originalRoute;
});

Tinytest.addAsync('Client - Router - notFound', function (test, done) {
  var data = [];
  FineRouter.notFound = {
    subscriptions: function() {
      data.push("subscriptions");
    },
    action: function() {
      data.push("action");
    }
  };

  FineRouter.go("/" + Random.id());
  setTimeout(function() {
    test.equal(data, ["subscriptions", "action"]);
    done();
  }, 50);
});

Tinytest.addAsync('Client - Router - withReplaceState - enabled',
function (test, done) {
  var pathDef = "/" + Random.id() + "/:id";
  var originalRedirect = FineRouter._page.replace;
  var callCount = 0;
  FineRouter._page.replace = function(path) {
    callCount++;
    originalRedirect.call(FineRouter._page, path);
  };

  FineRouter.route(pathDef, {
    name: name,
    action: function(params) {
      test.equal(params.id, "awesome");
      test.equal(callCount, 1);
      FineRouter._page.replace = originalRedirect;
      // We don't use Meteor.defer here since it carries
      // Meteor.Environment vars too
      // Which breaks our test below
      setTimeout(done, 0);
    }
  });

  FineRouter.withReplaceState(function() {
    FineRouter.go(pathDef, {id: "awesome"});
  });
});

Tinytest.addAsync('Client - Router - withReplaceState - disabled',
function (test, done) {
  var pathDef = "/" + Random.id() + "/:id";
  var originalRedirect = FineRouter._page.replace;
  var callCount = 0;
  FineRouter._page.replace = function(path) {
    callCount++;
    originalRedirect.call(FineRouter._page, path);
  };

  FineRouter.route(pathDef, {
    name: name,
    action: function(params) {
      test.equal(params.id, "awesome");
      test.equal(callCount, 0);
      FineRouter._page.replace = originalRedirect;
      Meteor.defer(done);
    }
  });

  FineRouter.go(pathDef, {id: "awesome"});
});

Tinytest.addAsync('Client - Router - withTrailingSlash - enabled', function (test, next) {
  var rand = Random.id();
  var rendered = 0;

  FineRouter.route('/' + rand, {
    action: function(_params) {
      rendered++;
    }
  });

  FineRouter.withTrailingSlash(function() {
    FineRouter.go('/' + rand);
  });

  setTimeout(function() {
    test.equal(rendered, 1);
    test.equal(_.last(location.href), '/');
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - idempotent routing - action',
function (test, done) {
  var rand = Random.id();
  var pathDef = "/" + rand;
  var rendered = 0;

  FineRouter.route(pathDef, {
    action: function(params) {
      rendered++;
    }
  });

  FineRouter.go(pathDef);

  Meteor.defer(function() {
    FineRouter.go(pathDef);

    Meteor.defer(function() {
      test.equal(rendered, 1);
      done();
    });
  });
});

Tinytest.addAsync('Client - Router - idempotent routing - triggers',
function (test, next) {
  var rand = Random.id();
  var pathDef = "/" + rand;
  var runnedTriggers = 0;
  var done = false;

  var triggerFns = [function(params) {
    if (done) return;

    runnedTriggers++;
  }];

  FineRouter.triggers.enter(triggerFns);

  FineRouter.route(pathDef, {
    triggersEnter: triggerFns,
    triggersExit: triggerFns
  });

  FineRouter.go(pathDef);

  FineRouter.triggers.exit(triggerFns);

  Meteor.defer(function() {
    FineRouter.go(pathDef);

    Meteor.defer(function() {
      test.equal(runnedTriggers, 2);
      done = true;
      next();
    });
  });
});

Tinytest.addAsync('Client - Router - reload - action',
function (test, done) {
  var rand = Random.id();
  var pathDef = "/" + rand;
  var rendered = 0;

  FineRouter.route(pathDef, {
    action: function(params) {
      rendered++;
    }
  });

  FineRouter.go(pathDef);

  Meteor.defer(function() {
    FineRouter.reload();

    Meteor.defer(function() {
      test.equal(rendered, 2);
      done();
    });
  });
});

Tinytest.addAsync('Client - Router - reload - triggers',
function (test, next) {
  var rand = Random.id();
  var pathDef = "/" + rand;
  var runnedTriggers = 0;
  var done = false;

  var triggerFns = [function(params) {
    if (done) return;

    runnedTriggers++;
  }];

  FineRouter.triggers.enter(triggerFns);

  FineRouter.route(pathDef, {
    triggersEnter: triggerFns,
    triggersExit: triggerFns
  });

  FineRouter.go(pathDef);

  FineRouter.triggers.exit(triggerFns);

  Meteor.defer(function() {
    FineRouter.reload();

    Meteor.defer(function() {
      test.equal(runnedTriggers, 6);
      done = true;
      next();
    });
  });
});

Tinytest.addAsync(
'Client - Router - wait - before initialize',
function(test, done) {
  FineRouter._initialized = false;
  FineRouter.wait();
  test.equal(FineRouter._askedToWait, true);

  FineRouter._initialized = true;
  FineRouter._askedToWait = false;
  done();
});

Tinytest.addAsync(
'Client - Router - wait - after initialized',
function(test, done) {
  try {
    FineRouter.wait();
  } catch(ex) {
    test.isTrue(/can't wait/.test(ex.message));
    done();
  }
});

Tinytest.addAsync(
'Client - Router - initialize - after initialized',
function(test, done) {
  try {
    FineRouter.initialize();
  } catch(ex) {
    test.isTrue(/already initialized/.test(ex.message));
    done();
  }
});

Tinytest.addAsync(
'Client - Router - base path - url updated',
function(test, done) {
  var simulatedBasePath = '/fine';
  var rand = Random.id();
  FineRouter.route('/' + rand, { action: function() {} });

  setBasePath(simulatedBasePath);
  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.equal(location.pathname, simulatedBasePath + '/' + rand);
    resetBasePath();
    done();
  }, 100);
});

Tinytest.addAsync(
'Client - Router - base path - route action called',
function(test, done) {
  var simulatedBasePath = '/fine';
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    action: function() {
      resetBasePath();
      done();
    }
  });

  setBasePath(simulatedBasePath);
  FineRouter.go('/' + rand);
});

Tinytest.add(
'Client - Router - base path - path generation',
function(test, done) {
  _.each(['/fine', '/fine/', 'fine/', 'fine'], function(simulatedBasePath) {
    var rand = Random.id();
    setBasePath(simulatedBasePath);
    test.equal(FineRouter.path('/' + rand), '/fine/' + rand);
  });
  resetBasePath();
});


function setBasePath(path) {
  FineRouter._initialized = false;
  FineRouter._basePath = path;
  FineRouter.initialize();
}

var defaultBasePath = FineRouter._basePath;
function resetBasePath() {
  setBasePath(defaultBasePath);
}

function bind(obj, method) {
  return function() {
    obj[method].apply(obj, arguments);
  };
}
