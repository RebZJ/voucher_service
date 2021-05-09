import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebaseConf } from "../../lib/config";

const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default function ServiceTypes(props) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState(null);

  useEffect(() => {
    async function getData() {
      const data = [];
      const dbRef = firebase.database().ref();
      await dbRef
        .child("voucherTypeService")
        .child("voucherType")
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            data.value = snapshot.val();
            // console.log(data.value)
            for (var i of snapshot.val()) {
              data.push(i);
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setServices(data);

      return services;
    }
    getData();
  }, []);

  function populate() {
    var list = [];
    for (let i in services) {
      if (services[i].uid) {
        list.push(<ServiceComponent services={services[i]} key={i} />);
      }
    }
    return list;
  }

  return services ? (
    <div className="justify-center flex min-h-screen ">
      <div className="pt-10">
        <ul>{populate()}</ul>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

function ServiceComponent(props) {
  function updateInfo() {}
  return (
    <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
      <p className="font-bold">Service Types</p>
      <div>
        <p>Name: {props.services.name}</p>
        <p>Delevery options: {props.services.deliveryOptions} </p>
        <p>Location: {props.services.location}</p>
        <p>Points: {props.services.points}</p>
      </div>

      <div>
        <button
          className="bg-blue-500 
                hover:bg-blue-700 text-white font-bold 
                py-2 px-4 mt-4 rounded"
          onClick={() => updateInfo()}
        >
          Add new Services
        </button>
      </div>
    </div>
  );
}
