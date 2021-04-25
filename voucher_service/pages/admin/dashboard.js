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
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const logout = () => {
        firebase.auth().signOut();
        setIsSignedIn(false);
        setIsAdmin(false);
        router.replace('/login');
    }

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

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
                
                // Check if the user is an admin
                getAdminUID().then((data) => {
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
        return (
            <div>
                <h1>Admin dashboard</h1>
                <p>Welcome admin! You are now signed in!</p>
                <button onClick={() => logout()}>Logout</button>
            </div>
        )
    }

    // loading screen goes here
    return (
        <div>
            <h1>Loading</h1>
        </div>
    )
}

export default userScreen;