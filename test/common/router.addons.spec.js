Router = FineRouter.Router;

Tinytest.addAsync('Common - Addons - onRouteRegister basic usage', function (test, done) {
  var name = Random.id();
  var customField = Random.id();
  var pathDef = '/' + name;
  
  FineRouter.onRouteRegister(function(route) {
    test.equal(route, {
      pathDef: pathDef,

      // Route.path is deprecated and will be removed in 3.0
      path: pathDef,

      name: name,
      options: {customField: customField}
    });  
    FineRouter._onRouteCallbacks = [];
    done();
  });

  FineRouter.route(pathDef, {
    name: name,
    action: function() {},
    subscriptions: function() {},
    triggersEnter: function() {},
    triggersExit: function() {},
    customField: customField
  });
});
