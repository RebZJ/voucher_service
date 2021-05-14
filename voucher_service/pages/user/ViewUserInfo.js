import React from "react";

import { useState, useEffect } from 'react';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import {firebaseConf} from "../../lib/config";
import {getData} from "../../lib/firebaseUtil";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf);
} else {
    firebase.app();
}
export default function ViewUserInfo(props) {
    const [personalInfo, setPersonalInfo] = useState('');
    const [billerInfo, setBillerInfo] = useState('');
    const [pointsRemaining, setPointsRemaining] = useState('');

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [notLoggedOn, setNotLoggedOn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setIsSignedIn(!!user);
                getData(firebase).then((data) => {
                    setPersonalInfo(data.personalInfo);
                    setBillerInfo(data.billerInfo);
                    setPointsRemaining(data.points);
                })
            } else {
                setNotLoggedOn(true);
            }
        });
        return () => authObserver();
    }, []);

    function populate() {
        var list = [];
        console.log(personalInfo)
        const allInfo = [personalInfo, billerInfo, pointsRemaining];
        list.push(<PersonalInfoComponent info={allInfo[0]} key={0} />);
        list.push(<BillerInfoComponent info={allInfo[1]} key={1} />);
        list.push(<PointsRemainingComponent info={allInfo[2]} key={2} />);
        return list;
    }

    if(isSignedIn || notLoggedOn) {
        if(isSignedIn) {
            return (
                <div className="justify-center flex min-h-screen ">
                    <div className="pt-10">
                        <ul>{populate()}</ul>
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
};
function PointsRemainingComponent(props) {
    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Points Remaining:</p>
            <div>
                <p>{props.info}</p>
            </div>
        </div>)
}

function PersonalInfoComponent(props) {
    const router = useRouter();
    function updateInfo() {
        router.replace(`/user/UpdateUserInfo/`);
    }

    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Personal Details:</p>
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
    const router = useRouter();
    function updateInfo() {
        router.replace(`/user/UpdateUserInfo/`);
    }

    return (
        <div className=" m-4 shadow-xl rounded-lg max-w-sm h-auto p-10 flex flex-col bg-blue-200">
            <p className="font-bold">Biller Details:</p>
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