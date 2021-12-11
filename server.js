// Load the express library
const express = require("express");

// Load bodyParse from the body-parser library
const bodyParser = require("body-parser");

// Load the path module to be used in the deployment
// configuration  below
const path = require("path");

// Create the app object from the top-level express function call
// to initialize the express app
const app = express();

// Load the routes file to be able to use it
const apiRoutes = require("./routes");

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

// Heroku Deployment Configuration
// To enable Express to serve up resources that have been build
// from the React app. React makes available the files in the
// in a build directory in production
// FIXME: Update the path again and test
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

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

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`App server is listening on PORT ${PORT}`);
});
