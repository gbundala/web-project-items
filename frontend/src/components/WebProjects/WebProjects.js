import React, { useEffect, useState } from "react";
import AddItem from "../AddItem/AddItem";
import WebProjectItem from "../WebProjectItem/WebProjectItem";
import "./WebProjects.css";

/**
 *
 * The WebProjects component is the main component which
 * handles all the major business logic of this application
 * of making the GET, POST, PUT and DELETE calls to the
 * endpoints exposed by the Express application using the fetch
 * method.
 *
 * The presentational bits of this app have been delegated over
 * to the respective children of this component allowing
 * this component to focus on the logic and data fetching
 * tasks. All event handlers are defined here as well as the
 * main state variables that are relevant to the most part
 * of the application.
 *
 * The useEffect has been used to make the GET request upon
 * mounting of the component on the DOM. Whereas the event
 * handlers has been used to make the POST, PUT and DELETE
 * request. The PUT and POST method includes headers and body
 * to pass data from the React app to the Express server
 */

export default function WebProjects() {
  const [webProjectItems, setwebProjectItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // POST Request
  function handleAddItem(projectItem) {
    fetch("api/addItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectItem),
    })
      .then((res) => res.json())
      .then((data) => {
        setwebProjectItems(data.webProjectItemsArray);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in adding item: ", err);
      });
  }

  // PUT Request
  function handleEditItem(editedItem) {
    fetch(`api/updateItem/${editedItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedItem),
    })
      .then((res) => res.json())
      .then((data) => {
        setwebProjectItems(data.webProjectItemsArray);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in updating item: ", err);
      });
  }

  // DELETE Request
  function handleDeleteItem(deletedItem) {
    fetch(`api/deleteItem/${deletedItem.id}`, {
      method: "DELETE",
      // No headers or body property is being defined here
      // since no data is being sent through the body
      // of the request. We are just specifying the id
      // of the item to be deleted in the params
    })
      .then((res) => res.json())
      .then((data) => {
        setwebProjectItems(data.webProjectItemsArrayAfterDelete);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error in deleting item: ", err);
      });
  }

  useEffect(() => {
    console.log("onmounting inside effect", webProjectItems);
    console.log("whats the error inside effect", error);
    // this variable is useful to determine when to set the
    // webProjectItems state variable. We therefore set the ignore
    // setting state variable to true in the return statement
    // to avoid setting the state process when the component
    // is unmounted from the DOM
    let ignoreSettingState = false;

    // GET Request
    // fetching the data from our Custom API and managing it
    // we use the endpoints exposed by our restful API
    // in the fetch method below
    // Further we parse json() on the response since we receive\
    // the data in json format from our Custom API
    // then we set the data in the state variable
    fetch("/api")
      .then((res) => {
        console.log("res response:", res);
        return res.json();
      })
      .then(
        (data) => {
          console.log("what is the data:", data);
          if (!ignoreSettingState)
            setwebProjectItems(data.webProjectItemsArray);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

    // Clean Up
    return () => {
      // we set the ignorSettingState variable to true
      // in order to avoid setting the state variable
      // webProjectItems when this component is
      // unmounted from the DOM or when it no longer
      // exists in the DOM tree
      ignoreSettingState = true;
    };
  }, []);

  console.log("onmounting outside", webProjectItems);
  console.log("whats the error outside", error);
  return (
    <div className="main-wrapper">
      <h1>Web Project Items</h1>

      <AddItem setLoading={setLoading} handleAddItem={handleAddItem} />

      {loading && <p>Loading...</p>}

      {error && <p>Something is wrong!</p>}

      <div className="project-items-wrapper">
        {webProjectItems &&
          webProjectItems.map((webProjectItem) => {
            return (
              <WebProjectItem
                key={webProjectItem.id}
                projectItem={webProjectItem}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
              />
            );
          })}
      </div>
    </div>
  );
}
