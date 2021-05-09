import UpdateUserInfoForm from "../../components/UpdateUserInfoForm";
import Head from "next/dist/next-server/lib/head";
import React from "react";
import {firebaseConf} from '../../lib/config';
import firebase from "firebase";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function UpdateUserInfo() {
    return (
        <div>
            <Head>
                <title>Update User Info</title>
            </Head>

            <h1>Update User Info</h1> <br/> <br/> <br/>


            <UpdateUserInfoForm/>
        </div>
    )
}