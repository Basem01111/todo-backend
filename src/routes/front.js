var express = require('express');
var router = express.Router();
const {authMiddlewareFront} = require('../shared/middlewares/auth.middleware');

// Importing routers
const tasksRouter = require('../features/front/tasks/tasks.route');

// Use routers
router.use(authMiddlewareFront);
router.use('/tasks', tasksRouter);

// Export routers
module.exports = router;
