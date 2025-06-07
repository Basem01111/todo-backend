var express = require("express");
var app = express();
var createError = require("http-errors");
var logger = require("morgan");
const connectDB = require("../config/db");
const cors = require("cors");
const apiResponse = require("./utils/apiResponse");
var cookieParser = require('cookie-parser')

// Routers
var authRouter = require("./routes/auth");
var frontRouter = require("./routes/front");
var adminRouter = require("./routes/admin");

// Use Logger
app.use(logger("dev"));

// Connect to the database
connectDB();

// Enable CORS 
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true ,
  optionsSuccessStatus: 200
}));

// Use Cookie
app.use(cookieParser())

// Json Data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", frontRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  apiResponse(
    res,
    status,
    message,
    req.app.get("env") === "development" ? err.stack : null
  );
});
module.exports = app;
