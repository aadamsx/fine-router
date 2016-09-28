// Export Router Instance
FineRouter = new Router();
FineRouter.Router = Router;
FineRouter.Route = Route;

// Initialize FineRouter
Meteor.startup(function () {
  if(!FineRouter._askedToWait) {
    FineRouter.initialize();
  }
});
