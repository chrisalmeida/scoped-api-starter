// Load environment variables
require("dotenv").config();

const express = require("express"),
  usersRouter = require("./routes/users"),
  uuid = require("uuid/v4"),
  jwtCheck = require("express-jwt"),
  {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
  } = require("./errors/api"),
  pino = require("express-pino-logger"),
  { JWT_SECRET } = process.env;

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request ID to request object
app.use((req, _res, next) => {
  req.id = req.header("x-request-id") || uuid();
  next();
});

app.use(pino({ redact: ["req.headers.authorization"] }));
app.use(jwtCheck({ secret: JWT_SECRET }));

// ROUTES

app.use("/users", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const e = new NotFoundError();
  next(e);
});

// Catch all errors
app.use((err, req, res, _next) => {
  if (err) {
    let result = new ApiError();

    if (err instanceof ApiError) {
      result = err;
    }

    if (err instanceof jwtCheck.UnauthorizedError) {
      result = new UnauthorizedError();
    }

    if (err.statusCode === 403) {
      result = new ForbiddenError();
    }

    // Log errors
    req.log.error(err);

    // Keep meta internal only
    delete result.meta;
    return res.status(result.status).json(result);
  }
});

module.exports = app;
