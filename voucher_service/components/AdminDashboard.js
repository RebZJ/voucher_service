import { useRouter } from "next/router";
import AddNewServiceType from "./AddNewServiceType";
import { useState, useEffect } from "react";
import firebase from 'firebase';
import { firebaseConf } from '../lib/config';


const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default function AdminDashboard() {
  const router = useRouter();

  const logout = () => {
    firebase.auth().signOut();
    router.replace("/login");
  };

  const [bookState, setStateBook] = useState(null);
  const [voucherState, setVoucherState] = useState(null);

  useEffect(() => {
    async function getVoucherData() {
      var data = {}
      const dbRef = firebase.database().ref();

      await dbRef.child("voucherTypeService").child("voucherType").get().then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();

        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.log(error);
      });
      setVoucherState(data)

      return data;
    }


    async function getBookData() {
      var data = {}
      const dbRef = firebase.database().ref();
      await dbRef.child("voucherBookings").get().then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();

        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.log(error);
      });
      setStateBook(data)

      return data;
    }
    getVoucherData()
    getBookData()
  }, []
  )
  useEffect(() =>
    console.log(voucherState), [voucherState])

  function populateBooking() {
    var list = [];
    for (let i in bookState) {

      if (bookState[i].uid) {
        list.push(<BookingComponent book={bookState[i]} item={i} key={i} />);
      }
    }
    return list;
  }

  function populateVoucher() {
    var list = [];
    for (let i in voucherState) {

      list.push(<VoucherTypeComponent voucher={voucherState[i]} item={i} key={i} />);
    }
    return list;
  }



  return (

    <div className="flex flex-col pt-20 ">

      <div className="justify-center flex flex-col ">
        <div className="flex justify-evenly pt-20 ">
          <h1 className=" font-bold">Admin Dashboard</h1>
          <p>Welcome admin! You are now signed in!</p>
          <button className="bg-blue-500 
              hover:bg-blue-700 text-white font-bold 
              py-2 px-2  rounded" onClick={() => logout()}>Logout</button>
        </div>
        {/* <div >

          <AddNewServiceType />
          <button onClick={() => logout()}>Logout</button>
        </div> */}


      </div>
      <div className="flex flex-row justify-center pt-10">{
        bookState ?
          <div className="justify-center flex min-h-screen px-2">
            <div >
              <p className="font-bold">Bookings</p>
              <ul>{populateBooking()}</ul>
            </div>
          </div>
          :
          <div>Loading...</div>}
        {
          voucherState ?
            <div className="justify-center flex min-h-screen px-2">
              <div >
                <p className="font-bold">VoucherType Services</p>
                <ul>{populateVoucher()}</ul>
              </div>
            </div>
            :
            <div>Loading...</div>}
        <AddNewServiceType />
      </div>


    </div >
  );
}




/**components below */

function VoucherTypeComponent(props) {
  const [appear, setAppear] = useState("Remove")
  const dbRef = firebase.database().ref().child("voucherTypeService").child("voucherType");

  async function updateInfo(event) {
    await dbRef.child(String(props.item)).remove()
    alert("Removed")
    setAppear("Removed")
  }

  return (
    <div className=" my-4 shadow-md rounded-lg max-w-sm h-auto p-2 flex flex-col bg-blue-200">
      <div>
        <p>Name: {props.voucher.name}</p>
        <p>Location: {props.voucher.location}</p>
        <p>Points: {props.voucher.points}</p>
        <p>DeliveryOptions: {props.voucher.deliveryOptions[1] ? "1 and 2" : "1"}</p>
      </div>

      <div>
        <button className=" bg-red-500
              hover:bg-red-700 text-white font-bold 
              py-2 px-2 mt-2 rounded" onClick={() => updateInfo()}>
          {appear}
        </button>
      </div>
    </div>)
}

function BookingComponent(props) {
  const [statusOf, setStatus] = useState(props.book.status)

  const dbRef = firebase.database().ref().child("voucherBookings");

  function updateInfo(e) {
    setStatus(e.target.value)
  }

  async function upd() {

    await dbRef.child(String(props.item)).update({
      status: statusOf
    })
    alert("Status Updated")
  }


  return (
    <div className=" my-4 shadow-md rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
      <p className="font-bold">Booking by: {props.book.uid}</p>
      <div>

        <p><span>Time: </span><span>{props.book.time}{" "}</span>

          <span>Date: {props.book.date}</span>
        </p>
        <p>Delivery: {props.book.delivery}</p>
        <p>Location: {props.book.location}</p>
        <p>Message: {props.book.message}</p>
        {/* <p>Status: {props.book.status}</p> */}

        <p>Voucher Type: {props.book.voucherType}</p>
        <span>Status: <select value={statusOf} onChange={updateInfo}>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
        </select>
        </span>
      </div>

      <div>
        <button className="bg-blue-500 
              hover:bg-blue-700 text-white font-bold 
              py-2 px-4 mt-4 rounded" onClick={() => upd()}>
          Save Status
        </button>
      </div>
    </div>)
}