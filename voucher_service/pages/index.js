import Head from 'next/head';
import UpdateUserInfo from '../components/UpdateUserInfo';
import React from "react";

import { useState, useEffect } from 'react';
import firebase from 'firebase';

export default function ViewUserInfo(props) {
    const [personalInfo, setPersonalInfo] = useState('');
    const [billerInfo, setBillerInfo] = useState('');

    useEffect(() => {
            async function getData() {
                var data = ''
                const uid = firebase.auth().currentUser.uid;
                const dbRef = firebase.database().ref();
                await dbRef.child("users").child(String(uid)).child("personalInfo").get().then((snapshot) => {
                    if (snapshot.exists()) {
                        data = snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.log(error);
                });
                setPersonalInfo(data);

                await dbRef.child("users").child(String(uid)).child("billerInfo").get().then((snapshot) => {
                    if (snapshot.exists()) {
                        data = snapshot.val();
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.log(error);
                });
                setBillerInfo(data);
            }
            getData()
        }, []
    );

    function populate() {
        var list = [];
        const allInfo = [personalInfo, billerInfo];
        list.push(<PersonalInfoComponent info={allInfo[0]} key={0} />);
        list.push(<BillerInfoComponent info={allInfo[1]} key={1} />);
        return list;
    }

    return (
        personalInfo ?
            <div className="justify-center flex min-h-screen ">
                <div className="pt-10">
                    <ul>{populate()}</ul>
                </div>
            </div>
            :
            <div>Loading...</div>
    )
};

function PersonalInfoComponent(props) {
    function updateInfo() {

    }
    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Personal Details: {firebase.auth().currentUser.displayName}</p>
            <div>
                <p>Name: {props.info.name}</p>
                <p>Email: {props.info.email}</p>
                <p>Contact Number: {props.info.contactNumber}</p>
            </div>

            <div>
                <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => updateInfo()}>
                    Modify
                </button>
            </div>
        </div>)
}

function BillerInfoComponent(props) {
    function updateInfo() {

    }
    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Biller Details: {firebase.auth().currentUser.displayName}</p>
            <div>
                <p>Biller Email: {props.info.billerEmailAddress}</p>
                <p>Invoice Name: {props.info.invoiceName}</p>
            </div>

            <div>
                <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => updateInfo()}>
                    Modify
                </button>
            </div>
        </div>)
}