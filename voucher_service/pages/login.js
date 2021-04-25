import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useRouter } from 'next/router';
import { firebaseConf } from '../lib/config'

const firebaseConfig = firebaseConf;

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}

const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
};

async function getAdminUID() {
    const data = {key:null, value:null}

    const dbRef = firebase.database().ref();
    await dbRef.child("Admin").child("Admin").get().then((snapshot) => {
        if (snapshot.exists()) {
            data.key = snapshot.key;
            data.value = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.log(error);
    });
    return data;
}

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
        getAdminUID().then((data) => {
            if(firebase.auth().currentUser.uid == data.value) {
                router.push('/admin/dashboard');
            } else {
                router.push(`/user/${firebase.auth().currentUser.uid}`);
            }
        })
    }
    return <h1>loading</h1>;
}

export default LoginScreen;
