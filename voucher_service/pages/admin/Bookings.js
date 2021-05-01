import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config';

const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

export default function VBookings(props) {
    const [bookState, setStateBook] = useState(null);

    useEffect(() => {
        async function getData() {
            const data = []
            const dbRef = firebase.database().ref();
            await dbRef.child("voucherBookings").get().then((snapshot) => {
                if (snapshot.exists()) {
                    data.value = snapshot.val();
                    // console.log(data.value)
                    for (var i of snapshot.val()) {
                        data.push(i)
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
            setStateBook(data)

            return data;
        }
        getData()
    }, []
    )

    function populate() {
        var list = [];
        for (let i in bookState) {
            if (bookState[i].uid) {
                list.push(<BookingComponent book={bookState[i]} key={i} />);
            }
        }
        return list;
    }

    return (
        bookState ?
            <div className="justify-center flex min-h-screen ">
                <div className="pt-10">
                    <ul>{populate()}</ul>
                </div>
            </div>

            :
            <div>Loading...</div>
    )
}


function BookingComponent(props) {

    function updateInfo() {

    }
    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Booking by: {props.book.uid}</p>
            <div>

                <p><span>Time: </span><span>{props.book.time}{" "}</span>

                    <span>Date: {props.book.date}</span>
                </p>
                <p>Delivery: {props.book.delivery}</p>
                <p>Location: {props.book.location}</p>
                <p>Message: {props.book.message}</p>
                <p>Status: {props.book.status}</p>
                <p>Voucher Type: {props.book.voucherType}</p>

            </div>

            <div>
                <button className="bg-blue-500 
                hover:bg-blue-700 text-white font-bold 
                py-2 px-4 mt-4 rounded" onClick={() => updateInfo()}>
                    Modify
                </button>
            </div>
        </div>)
}