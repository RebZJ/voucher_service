import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config';
import { checkIfAdmin } from '../../lib/firebaseUtil';
import AdminDashboard from './AdminDashboard';

const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

export default function userScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [notLoggedOn, setNotLoggedOn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                // Check if the user is an admin
                checkIfAdmin(firebase).then((data) => {
                    if ("Admin" == data.value.role) {
                        setIsSignedIn(!!user);
                    } else {
                        // not an admin
                        router.replace('/login');
                    }
                })
            } else {
                setNotLoggedOn(true);
            }
        });
        return () => authObserver();
    }, []);

    if(isSignedIn || notLoggedOn) {
        if(isSignedIn) {
            return (
                <AdminDashboard firebase={firebase}/>
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