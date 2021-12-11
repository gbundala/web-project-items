// Load the express library
const express = require("express");

// Create an apiRouter object by calling the Router() method
// on the express library
const apiRouter = express.Router();

// Load file handler from Node fs core library
const fsHandler = require("fs");

// Pull the array of Web Project Items from the json file
// we invoke the readFileSync method (with the path) as we want to
// synchronously read the file because we only want
// to call the routes after we have loaded the content
// of the web project items json file
// Below is good resource on fs core module and the methods
// https://www.tutorialsteacher.com/nodejs/nodejs-file-system
const webProjectItems = fsHandler.readFileSync("./projectItems.json");

// we parse the returned items to convert the returned string
// to an object
const webProjectItemsArray = JSON.parse(webProjectItems);

// We create a function to generate unique number IDs
// Below is a reference to MDN on random number generation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const createNewID = function () {
  const newID = Math.floor(Math.random() * Date.now());
  return newID;
};

// ROUTERS

// GET Request to access the list of web project items
apiRouter.get("/", function (req, res) {
  res.json({
    messag: "Getting data from server",
    webProjectItemsArray,
  });
});

// POST Request to add additional items to the list
apiRouter.post("/addItem", function (req, res) {
  const id = createNewID();
  const newItem = Object.assign({ id }, req.body);

  // push to webProjectItemsArray
  webProjectItemsArray.push(newItem);

  // write to the json file
  //   The writeFile method accepts the data parameter only as
  // a string hence we convert the Array instance to a string
  // we throw any errors in the callback parameter of the
  //   writeFile method
  fsHandler.writeFile(
    "./projectItems.json",
    JSON.stringify(webProjectItemsArray),
    (err) => {
      if (err) throw err;
      console.log("The JSON file has been updated with the new array of items");
    }
  );

  // return json
  return res.json({
    message: "New web project item added to the list!",
    webProjectItemsArray,
  });
});

// PUT Request to update an item in the list
apiRouter.put("/updateItem/:id", function (req, res) {
  const id = parseInt(req.params.id);

  // iterate over the list of the array to only update the
  // item object whose id match the provided id
  // We also go deeper into the object to only update
  // the value of the property that the user has changed
  // for the unchanged properties in the object we return
  // the same values
  for (let idx = 0; idx < webProjectItemsArray.length; idx++) {
    if (webProjectItemsArray[idx].id === id) {
      const newUpdatedObj = { ...webProjectItemsArray[idx] };

      // we get the array of the keys in the object provided
      // by the user in the body of the request and assign it
      // to the variable updatedItemKeysArray using the
      // Object.key() JavaScript method
      const updatedItemKeysArray = Object.keys(req.body);

      // We iterate over the keys of the object provided by the
      // user and only update the values of that key in the
      // updated Object. Otherwise we just return the same
      // property names and values that are existing in the object
      for (let i = 0; i < updatedItemKeysArray.length; i++) {
        // for each key in this array (which is the list of keys
        // that the user has updated) we update the value
        // in the newUpdatedObj created from the existing
        // array of Web Project Items
        newUpdatedObj[updatedItemKeysArray[i]] =
          req.body[updatedItemKeysArray[i]];
      }

      // update that obj with the new obj
      webProjectItemsArray[idx] = newUpdatedObj;
    }
  }

  // write to the json file
  fsHandler.writeFile(
    "./projectItems.json",
    JSON.stringify(webProjectItemsArray),
    (err) => {
      if (err) throw err;
      console.log("The JSON file has been updated with the new item");
    }
  );

  // return json
  return res.json({
    message: "Updated an item in the list!",
    webProjectItemsArray,
  });
});

// DELETE Request to delete an item from the list
apiRouter.delete("/deleteItem/:id", function (req, res) {
  const id = parseInt(req.params.id);

  // We use the array.filter() method to only filter
  // the items that are not deleted
  webProjectItemsArrayAfterDelete = webProjectItemsArray.filter((item) => {
    return item.id !== id;
  });

  //   write to the json file
  fsHandler.writeFile(
    "./projectItems.json",
    JSON.stringify(webProjectItemsArrayAfterDelete),
    (err) => {
      if (err) throw err;
      console.log("The JSON file has been updated after deleting an item");
    }
  );

  // return json
  return res.json({
    message: "Deleted an item from the list!",
    webProjectItemsArrayAfterDelete,
  });
});

// Exporting the module
module.exports = apiRouter;
