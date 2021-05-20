import React, {useEffect, useState} from "react";
import firebase from "firebase";

export default function CancellableUserBookings() {
    const [bookings, setBookings] = useState(null);
    const uid = firebase.auth().currentUser.uid;

    useEffect(() => {
            async function getBookingData() {
                var data = {};
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
                setBookings(data);
                return data;
            }
            getBookingData();
        }, []
    );

    function populateBooking() {
        var list = [];
        for (let i in bookings) {

            if (bookings[i].uid == uid && bookings[i].status == 'pending' || bookings[i].status == 'confirmed') {
                list.push(<BookingComponent book={bookings[i]} item={i} key={i} />);
            }
        }
        return list;
    }

    return (
        <div className="flex flex-row">{
            bookings ?
                <div className="justify-center flex min-h-screen p-4">
                    <div className="pt-10">
                        <ul>{populateBooking()}</ul>
                    </div>
                </div>
                :
                <div>Loading...</div>}
        </div>
    )
}

function BookingComponent(props, el) {
    const [statusOf, setStatus] = useState(props.book.status);
    const dbRef = firebase.database().ref();
    const uid = firebase.auth().currentUser.uid;
    function updateInfo(e) {
        setStatus(e.target.value)
    }
    async function upd() {
        // updating booking status
        await dbRef.child("voucherBookings").child(String(props.item)).update({
            status: statusOf
        });
        // refunding the user their points
        var data = {};
        await dbRef.child("users").child(uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.log(error);
        });
        var pointsRemaining = parseFloat(data.pointsRemaining);
        await dbRef.child("voucherTypeService").child("voucherType").get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.log(error);
        });
        var pointsNeeded = 0;
        for (let i in data) {
            if (data[i].name == props.book.voucherType) {
                pointsNeeded = parseFloat(data[i].points);
            }
        }
        await dbRef.child("users").child(uid).update(
            {pointsRemaining: pointsRemaining + pointsNeeded});
        window.location.reload()
    }

    return (
        <div className=" my-4 shadow-md rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Booking ID: {props.item}</p>
            <div>

                <p><span>Time: </span><span>{props.book.time}{" "}</span>

                    <span>Date: {props.book.date}</span>
                </p>
                <p>Delivery: {props.book.delivery}</p>
                <p>Location: {props.book.location}</p>
                <p>Message: {props.book.message}</p>

                <p>Voucher Type: {props.book.voucherType}</p>
                <span>Status: <select value={statusOf} onChange={updateInfo}>
                    <option value={props.book.status}>{props.book.status}</option>
                    <option value="cancelled">cancelled</option>
                </select>
                </span>
            </div>

            <div>
                <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => upd()}>
                    Update
                </button>
            </div>
        </div>)
}