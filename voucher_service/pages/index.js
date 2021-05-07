import Head from 'next/head';
import UpdateUserInfo from '../components/UpdateUserInfo';
import React from "react";

import { useState, useEffect } from 'react';
import firebase from 'firebase';

const Home = () => {
    const [userInfo, setUserInfo] = useState([]);
    const[billerEmailAddress, setBillerEmailAddress] = useState('');

    var data = '';
    //var invoiceName = '';

    useEffect(() => {
        const uid = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref().child("users").child(String(uid)).child("billerInfo").child("billerEmailAddress");

        dbRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                data = snapshot.val();
                console.log(data);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        /*
        dbRef.on('value', (snapshot) => {

            snapshot.forEach((childSnapshot) => {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
            })


            const userData = snapshot.val();
            setBillerEmailAddress(userData);
            console.log(userData);
            console.log(billerEmailAddress);
            // invoiceName = snapshot.child('invoiceName').val();
            // setUserInfo(data);
        });


        fire.firestore()
            .collection('blog')
            .onSnapshot(snap => {
                const blogs = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBlogs(blogs);
            });
        */
    }, []);


    return (
        <div>
            <Head>
                <title>User Info</title>
            </Head>

            <h1>User Info</h1> <br /> <br /> <br />


            <UpdateUserInfo />
        </div>
    )
};
export default Home;