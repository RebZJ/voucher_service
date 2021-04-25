import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config'

const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

function userScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [notLoggedOn, setNotLoggedOn] = useState(false);
    const router = useRouter();

    const logout = () => {
        firebase.auth().signOut();
        setIsSignedIn(false);
    }

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
            } else {
                setNotLoggedOn(true);
            }
        });
        return () => authObserver();
    }, []);

    if(isSignedIn || notLoggedOn) {
        if(isSignedIn) {
            return (
                <div>
                    <h1>Voucher-service</h1>
                    <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed in!</p>
                    <button onClick={() => logout()}>Logout</button>
                </div>
            )
        } else {
            router.replace('/login');
        }
    }

    // loading screen goes here
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default userScreen;