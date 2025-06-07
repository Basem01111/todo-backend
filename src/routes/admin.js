var express = require('express');
var router = express.Router();
const { authMiddlewareAdmin } = require('../shared/middlewares/auth.middleware');

// Importing routers
const usersRouter = require('../features/admin/users/users.route');

// Use routers
router.use(authMiddlewareAdmin)
router.use('/users', usersRouter);

// Export routers
module.exports = router;
