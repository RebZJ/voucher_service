import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { firebaseConf } from '../../lib/config';
import { useRouter } from "next/router";
import CancellableUserBookings from "../../components/CancellableUserBookings";
const firebaseConfig = firebaseConf;


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function ViewCancellableUserBookings() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [notLoggedOn, setNotLoggedOn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setIsSignedIn(!!user);
            } else {
                setNotLoggedOn(true);
            }
        });
        return () => authObserver();
    })

    if (isSignedIn || notLoggedOn) {
        if (isSignedIn) {
            return (
                <div className="flex justify-center min-h-screen pt-10 ">
                    <CancellableUserBookings />
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