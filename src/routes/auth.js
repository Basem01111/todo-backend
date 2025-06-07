var express = require('express');
var router = express.Router();

// Importing routers
const authRouter = require('../features/auth/auth.route');

// Use routers
router.use('/', authRouter);

// Export routers
module.exports = router;
