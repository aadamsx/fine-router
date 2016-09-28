Tinytest.addAsync('Client - Router - subsReady - with no args - all subscriptions ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('foo', Meteor.subscribe('foo'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);

  Tracker.autorun(function(c) {
    if(FineRouter.subsReady()) {
      FineRouter.subscriptions = Function.prototype;
      next();
      c.stop();
    }
  });
});

Tinytest.addAsync('Client - Router - subsReady - with no args - all subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('fooNotReady', Meteor.subscribe('fooNotReady'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('bazNotReady', Meteor.subscribe('bazNotReady'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady());
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with no args - global subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('foo', Meteor.subscribe('foo'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('bazNotReady', Meteor.subscribe('bazNotReady'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady());
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with no args - current subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('fooNotReady', Meteor.subscribe('fooNotReady'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady());
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with args - all subscriptions ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('foo', Meteor.subscribe('foo'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);
  Tracker.autorun(function(c) {
    if(FineRouter.subsReady('foo', 'baz')) {
      FineRouter.subscriptions = Function.prototype;
      next();
      c.stop();
    }
  });
});

Tinytest.addAsync('Client - Router - subsReady - with args - all subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('fooNotReady', Meteor.subscribe('fooNotReady'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('bazNotReady', Meteor.subscribe('bazNotReady'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady('fooNotReady', 'bazNotReady'));
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with args - global subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('foo', Meteor.subscribe('foo'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('bazNotReady', Meteor.subscribe('bazNotReady'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady('foo', 'bazNotReady'));
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with args - current subscriptions does not ready', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
      this.register('fooNotReady', Meteor.subscribe('fooNotReady'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady('fooNotReady', 'baz'));
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with args - subscribe with wrong name', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      this.register('bar', Meteor.subscribe('bar'));
    }
  });

  FineRouter.subscriptions = function () {
    this.register('baz', Meteor.subscribe('baz'));
  };

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(!FineRouter.subsReady('baz', 'xxx', 'baz'));
    FineRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - with args - same route two different subs', function (test, next) {
  var rand = Random.id();
  var count = 0;
  FineRouter.route('/' + rand, {
    subscriptions: function(params) {
      if(++count == 1) {
        this.register('not-exisitng', Meteor.subscribe('not-exisitng'));
      }
    }
  });

  FineRouter.subscriptions = Function.prototype;
  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isFalse(FineRouter.subsReady());
    FineRouter.go('/' + rand, {}, {param: "111"});
    setTimeout(function() {
      test.isTrue(FineRouter.subsReady());
      next();
    }, 100)
  }, 100);
});

Tinytest.addAsync('Client - Router - subsReady - no subscriptions - simple', function (test, next) {
  var rand = Random.id();
  FineRouter.route('/' + rand, {});
  FineRouter.subscriptions = Function.prototype;

  FineRouter.go('/' + rand);
  setTimeout(function() {
    test.isTrue(FineRouter.subsReady());
    next();
  }, 100);
});