// EXPRESS SETUPS, ROUTES & MIDDLEWARE

// IMPORTS

// Load the express library
const express = require("express");

// Load Helmet library for security
const helmet = require("helmet");

// Load bodyParse from the body-parser library
const bodyParser = require("body-parser");

// Load the path module to be used in the deployment
// configuration  below
const path = require("path");

// Load the routes file to be able to use it
const apiRoutes = require("./routes");

// EXPRESS APP INITIALIZATION

// Create the app object from the top-level express function call
// to initialize the express app
const app = express();

// MIDDLEWARES

// Calling helmet middleware which helps secure the App
// by setting various HTTP headers

// HACK: Included teh unsafe-inline directive as part of the CSP policy to rectify the error as per the message below

/**
 * ERROR MESSAGE:
 * Refused to execute inline script because it violates the
 *  following Content Security Policy directive: "script-src
 * 'self'". Either the 'unsafe-inline' keyword, a hash
 * ('sha256-1kri9uKG6Gd9VbixGzyFE/kaQIHihYFdxFKKhgz3b80='), or a
 * nonce ('nonce-...') is required to enable inline execution.
 *
 *
 * SOURCES:
 * https://help.fullstory.com/hc/en-us/articles/360020622854-Can-I-use-Content-Security-Policy-CSP-with-FullStory-
 * https://codeutility.org/helmet-content-security-policy-blocking-react-js/amp/
 * https://github.com/helmetjs/helmet
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 *
 */
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": null,
    },
  })
);

// Express middleware
// To enable the server to accept requests from the Body of
// a request in a json format.
app.use(express.json());

// The bodyParser middleware is used to parse the body
// of the request to read it and expose it to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the apiRoutes
app.use("/api", apiRoutes);

// DEPLOYMENT TO PRODUCTION

// Heroku Deployment Configuration
// To enable Express to serve up resources that have been build
// from the React app. React makes available the files in a build
// directory in production.
// KEY: This has to be below the routes in order to avoid bugs
// in production where we GET the HTML returned by React
// instead of the JSON objects being called in our GET methods
// in the fetch calls.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// ERROR HANDLING

// For general error handling inline with the gist below
// We use the "*" wildcard to capture any errors
// https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd#generalized-error-handling
// Then we respond with the message if the use enters
// a different route not specified here
app.get("*", function (req, res, next) {
  let err = new Error();

  // we set the status code to 404
  err.statusCode = 404;

  // In order to enable our middleware to redirect
  // we set the shouldRedirect property on the err
  // object to true
  err.shouldRedirect = true;
  next(err);
});

// Our error handling middleware
// We place our error handling middleware at the end after all
// routes and middleware in order to be able to catch any
// errors occuring the processes above
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send("Oops something is wrong!?!?");
});

// DYNAMIC PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`App server is listening on PORT ${PORT}`);
});
