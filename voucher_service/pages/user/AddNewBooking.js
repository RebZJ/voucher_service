import firebase from "firebase";
import {firebaseConf} from "../../lib/config";
import Head from "next/dist/next-server/lib/head";
import AddNewBookingForm from "../../components/AddNewBookingForm"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function AddNewBooking() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [notLoggedOn, setNotLoggedOn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
            } else {
                setNotLoggedOn(true);
            }
        });
        return () => authObserver();
    })

    if(isSignedIn || notLoggedOn) {
        if(isSignedIn) {
            return (
                <div className="flex justify-start min-h-screen pt-10 m-8">
                    <Head>
                        <title>Add New Booking</title>
                    </Head>
        
                    <h1>Add New Booking</h1> <br/> <br/> <br/>
        
        
                    <AddNewBookingForm/>
                </div>
            )
        } else {
            router.replace('/login');
        }
    }
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}