Tinytest.add('Client - Group - validate path definition', function (test, next) {
  // path & prefix must start with '/'
  test.throws(function() {
    new Group(null, {prefix: Random.id()});
  });

  var group = FineRouter.group({prefix: '/' + Random.id()});

  test.throws(function() {
    group.route(Random.id());
  });
});

Tinytest.addAsync('Client - Group - define and go to route with prefix', function (test, next) {
  var prefix = Random.id();
  var rand = Random.id();
  var rendered = 0;

  var group = FineRouter.group({prefix: '/' + prefix});

  group.route('/' + rand, {
    action: function(_params) {
      rendered++;
    }
  });

  FineRouter.go('/' + prefix + '/' + rand);

  setTimeout(function() {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Group - define and go to route without prefix', function (test, next) {
  var rand = Random.id();
  var rendered = 0;

  var group = FineRouter.group();

  group.route('/' + rand, {
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

Tinytest.addAsync('Client - Group - subscribe', function (test, next) {
  var rand = Random.id();

  var group = FineRouter.group({
    subscriptions: function (params) {
      this.register('baz', Meteor.subscribe('baz'));
    }
  });

  group.route('/' + rand);

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!!GetSub('baz'));
    next();
  }, 100);
});


Tinytest.addAsync('Client - Group - set and retrieve group name', function (test, next) {
  var rand = Random.id();
  var name = Random.id();

  var group = FineRouter.group({
    name: name
  });

  group.route('/' + rand);

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(FineRouter.current().route.group.name === name);
    next();
  }, 100);
});

Tinytest.add('Client - Group - expose group options on a route', function (test) {
  var pathDef = "/" + Random.id();
  var name = Random.id();
  var groupName = Random.id();
  var data = {aa: 10};
  var layout = 'blah';

  var group = FineRouter.group({
    name: groupName,
    prefix: '/admin',
    layout: layout,
    someData: data
  });

  group.route(pathDef, {
    name: name
  });

  var route = FineRouter._routesMap[name];

  test.equal(route.group.options.someData, data);
  test.equal(route.group.options.layout, layout);
});
