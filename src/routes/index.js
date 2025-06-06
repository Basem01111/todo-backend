var express = require('express');
var router = express.Router();

// Importing routers
const tasksRouter = require('../features/tasks/tasks.routes');
const usersRouter = require('../features/users/users.routes');
const authRouter = require('../features/auth/auth.routes');

// Use routers
router.use('/tasks', tasksRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

// Export routers
module.exports = router;
