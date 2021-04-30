import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useRouter } from 'next/router';
import { firebaseConf } from '../lib/config';
import { getAdminUID } from '../lib/firebaseUtil';

const firebaseConfig = firebaseConf;

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}

const uiConfig = {
    signInSuccessUrl: '/login',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
};

function LoginScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();

    // Listen to the firebase auth state and set the local state
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers
    }, []);

    if(!isSignedIn) {
        return (
            <div>
                <h1>Login</h1>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
        );
    } else {
        // The user has signed in we need to redirect them to the correct endpoints
        getAdminUID(firebase).then((data) => {
            if(firebase.auth().currentUser.uid == data.value) {
                router.replace('/admin/dashboard/');
            } else {
                router.replace(`/user/${firebase.auth().currentUser.uid}/`);
            }
        })
    }
    return <h1>loading</h1>;
}

export default LoginScreen;
