Tinytest.add('Common - Router - url - generic', function (test) {
  var pathDef = "/blog/:blogId/some/:name";
  var fields = {
    blogId: "1001",
    name: "superb"
  };
  var expectedUrl = Meteor.absoluteUrl('blog/1001/some/superb');

  var path = FineRouter.url(pathDef, fields);
  test.equal(path, expectedUrl);
});
