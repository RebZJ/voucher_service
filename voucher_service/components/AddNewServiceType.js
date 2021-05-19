import React, { useState } from "react";
import firebase from "firebase";

const AddNewServiceType = () => {
  const [Name, setName] = useState("");
  const [Location, setLocation] = useState("");
  const [DeliveryOptions, setOptions] = useState(["1", "2"]);
  const [Points, setPoints] = useState("");
  const [Notification, setNotification] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dbRef = firebase
      .database()
      .ref()
      .child("voucherTypeService")
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

    window.location.reload();
  };

  return (
    <div >

      <h2 className="font-bold">Add new service type</h2>

      <div className=" bg-blue-200 mt-4 p-4 rounded-md shadow-md">
        {Notification}
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
              value={Points}
              onChange={({ target }) => setPoints(target.value)}
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
          <button className="bg-blue-500 
              hover:bg-blue-700 text-white font-bold 
              py-2 px-4 mt-4 rounded" type="submit">Save</button>



        </form>
      </div>
    </div>
  );
};
export default AddNewServiceType;
