import UpdateUserInfoForm from "../../components/UpdateUserInfoForm";
import Head from "next/dist/next-server/lib/head";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { firebaseConf } from '../../lib/config';
import firebase from "firebase";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function UpdateUserInfo() {
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
    }, []);

    if (isSignedIn || notLoggedOn) {
        if (isSignedIn) {
            return (
                <div className="flex justify-center min-h-screen ">
                    <div className="pt-10 ">
                        <Head>
                            <title>Update User Info</title>
                        </Head>

                        <h1>Update User Info</h1> <br /> <br /> <br />

                        <UpdateUserInfoForm />
                    </div>
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