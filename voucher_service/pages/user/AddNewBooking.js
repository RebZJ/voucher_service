import firebase from "firebase";
import {firebaseConf} from "../../lib/config";
import Head from "next/dist/next-server/lib/head";
import AddNewBookingForm from "../../components/AddNewBookingForm"
import React from "react";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function AddNewBooking() {
    return (
        <div>
        <Head>
        <title>Add New Booking</title>
    </Head>

    <h1>Add New Booking</h1> <br/> <br/> <br/>


    <AddNewBookingForm/>
    </div>
)
}