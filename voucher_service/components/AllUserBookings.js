import React, {useEffect, useState} from "react";
import firebase from "firebase";

export default function AllUserBookings() {
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

            if (bookings[i].uid == uid) {
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

function BookingComponent(props) {
    const [statusOf, setStatus] = useState(props.book.status);
    const dbRef = firebase.database().ref().child("voucherBookings");
    function updateInfo(e) {
        setStatus(e.target.value)
    }
    async function upd() {

        await dbRef.child(String(props.item)).update({
            status: statusOf
        })
        console.log(statusOf)
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
                <p>Status: {props.book.status}</p>
            </div>
        </div>)
}