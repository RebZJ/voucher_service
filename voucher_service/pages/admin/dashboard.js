import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config';
import { getAdminUID } from '../../lib/firebaseUtil';
import AdminDashboard from './AdminDashboard';

const firebaseConfig = firebaseConf;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

export default function userScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
                
                // Check if the user is an admin
                getAdminUID(firebase).then((data) => {
                    if (data.value == firebase.auth().currentUser.uid) {
                        // isAdmin
                    } else {
                        // not an admin
                        router.replace('/login');
                    }
                })
            } else {
                // Not data returned
            }
        });
        return () => authObserver();
    }, []);

    if(isSignedIn) {
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