import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./AddItem.css";

/**
 *
 * The AddItem component is also a presentational component
 * to handle the presentation of the user interface that
 * allows for the user to add a new web project item
 *
 * Not much is happening in this component except for the setting
 * of the parent loading state as well as receiving the and
 * firing the handleAddItem event handler from the parent
 * component to invoke the event of adding an item
 */

export default function AddItem({ setLoading, handleAddItem }) {
  const [projectItem, setProjectItem] = useState({
    title: "",
    description: "",
    URL: "",
  });

  // the deep dive section in the new react docs provide
  // incredible guidance on updating the fields in
  // a form using a single event handler
  // https://beta.reactjs.org/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax
  function handleChange(e) {
    setProjectItem({
      ...projectItem,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="add-item-wrapper">
      <h4 className="add-item-title">Add a project Item</h4>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter title"
          name="title"
          value={projectItem.title}
          onChange={handleChange}
        />
        <FormControl
          placeholder="Enter description"
          name="description"
          value={projectItem.description}
          onChange={handleChange}
        />

        <FormControl
          placeholder="Enter URL"
          name="URL"
          value={projectItem.URL}
          onChange={handleChange}
        />

        <Button
          variant="outline-secondary"
          onClick={() => {
            setLoading(true);
            setProjectItem({ title: "", description: "", URL: "" });
            handleAddItem(projectItem);
          }}
        >
          Add Item
        </Button>
      </InputGroup>
    </div>
  );
}
