import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useRouter } from 'next/router';
import { firebaseConf } from '../lib/config';
import { checkIfAdmin, checkUser, addUser } from '../lib/firebaseUtil';

const firebaseConfig = firebaseConf;

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}

const uiConfig = {
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
            <div className="justify-center flex min-h-screen ">
                <div className="pt-10">
                    <h1>Login</h1>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                </div>
            </div>
        );
    } else {
        // First check if the user has been created
        checkUser(firebase).then((hasUser) => {
            console.log(hasUser);
            if (!hasUser) {
                console.log("Adding user");
                addUser(firebase);
            }
        });

        // Check if the user is an admin
        checkIfAdmin(firebase).then((data) => {
            if("Admin" == data.value.role) {
                router.replace('/admin/dashboard/');
            } else {
                router.replace(`/user/${firebase.auth().currentUser.uid}/`);
            }
        })
    }
    return <h1>loading</h1>;
}

export default LoginScreen;
