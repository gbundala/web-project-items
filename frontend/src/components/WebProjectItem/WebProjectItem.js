import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./WebProjectItem.css";

/**
 *
 * The WebProjectItem component is mostly a presentational
 * component to display the individual project Item objects
 *
 * For efficiency we have included the functionality to allow
 * the user to edit some properties in the object or to delete
 * the entire item. The business logic for handling the PUT
 * and DELETE requests have been handed over to the parent
 * component WebProjects.
 *
 * However we handle the local state of the individiual project
 * items in this component including toggling the edit mode to
 * allow the user to edit the item, also handlign the form
 * input control handled by React. These states are local and
 * ephemeral and hence best handled here in the child
 *
 * An interesting pattern implemented below is the dynamic
 * display of the value of the properties or the Form Control
 * depending on whether the user has toggled the edit mode on
 * or off. This is deemed the efficient and clean pattern rather
 * than having multiple return statements. The JavaScript
 * ternary operator has been useful here!
 */

export default function WebProjectItem({
  projectItem,
  handleEditItem,
  handleDeleteItem,
}) {
  // Object destructuring of the project item
  // We destructure the properties of the object
  // to be used in the below
  const { id, title, description, URL } = projectItem;

  // State variables
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState({
    title,
    description,
    URL,
    id,
  });

  // We use a single event handler using the [ and ] braces in
  // line with the guidance in the new React Docs
  // https://beta.reactjs.org/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax
  function handleChange(e) {
    setEditedItem({
      ...editedItem,
      [e.target.name]: e.target.value,
    });
  }

  if (!projectItem) return <p>Add an item to the list</p>;

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />

      <Card className="container py-5 h-100 card-style">
        <Card.Title>
          {editMode ? (
            <FormControl
              name="title"
              value={editedItem.title}
              onChange={handleChange}
            />
          ) : (
            title
          )}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {editMode ? (
            <FormControl
              name="URL"
              value={editedItem.URL}
              onChange={handleChange}
            />
          ) : (
            URL
          )}
        </Card.Subtitle>
        <Card.Text>
          {editMode ? (
            <FormControl
              name="description"
              value={editedItem.description}
              onChange={handleChange}
            />
          ) : (
            description
          )}
        </Card.Text>
        <div className="buttons-wrapper">
          <Button
            className="edit-button"
            variant="light"
            onClick={() => {
              if (editMode) {
                handleEditItem(editedItem);
                setEditMode(false);
              } else {
                setEditMode(true);
              }
            }}
          >
            {editMode ? "Done!" : "Edit"}
          </Button>

          <Button
            className="delete-button"
            variant="light"
            onClick={() => {
              handleDeleteItem(projectItem);
            }}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
