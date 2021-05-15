import React, { useState } from "react";
import firebase from "firebase";

const AddNewServiceType = () => {
  const [Name, setName] = useState("");
  const [Location, setLocation] = useState("");
  const [DeliveryOptions, setOptions] = useState(["1", "2"]);
  const [Points, setPoints] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dbRef = firebase
      .database()
      .ref()
      .child("voucherTypeServices")
      .child("voucherType");

    // don't update database if form is empty
    if (Name == "" && Location == "" && Points == "") {
      setNotification("No new information submitted");
      setTimeout(() => {
        setNotification("");
      }, 2000);
      return;
    }

    // add new service type

    await dbRef.push({
      name: Name,
      location: Location,
      points: Points,
      deliveryOptions: DeliveryOptions,
    });
    setName("");
    setLocation("");
    setPoints("");
    setOptions(["1", "2"]);
    setNotification("Information updated");
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  return (
    <div>
      <h2>Add new service type</h2>
      {notification}

      <form onSubmit={handleSubmit}>
        <div>
          Service Name
          <br />
          <textarea
            value={Name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Location
          <br />
          <textarea
            value={Location}
            onChange={({ target }) => setLocation(target.value)}
          />
        </div>
        <div>
          Points
          <br />
          <textarea
            value={Location}
            onChange={({ target }) => setLocation(target.value)}
          />
        </div>
        <div>
          Delivery Options
          <br />
          <textarea
            value={DeliveryOptions}
            onChange={({ target }) => setOptions(target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
export default AddNewServiceType;
