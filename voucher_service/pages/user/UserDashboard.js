import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

export default function UserDashboard({firebase}) {
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const authObserver = firebase.auth().onAuthStateChanged(user => {
            setUserData(user);
        });
        return () => authObserver();
    }, []);

    const logout = () => {
        router.replace('/login');
        firebase.auth().signOut();
    }

    return (
        <div className="justify-center flex min-h-screen ">
            <div className="pt-10">
                <p><b>Welcome {userData ? userData.displayName : "unknown user"}! You are now signed in!</b></p>
                <div>
                    <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => router.replace('/user/AddNewBooking')}>
                        Make a New Booking
                    </button>
                </div>
                <div>
                    <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => router.replace('/user/ViewCancellableUserBookings')}>
                        Cancel Booking
                    </button>
                </div>
                <div>
                    <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => router.replace('/user/ViewAllUserBookings')}>
                        View All Bookings
                    </button>
                </div>
                <div>
                    <button className="bg-blue-500
                hover:bg-blue-700 text-white font-bold
                py-2 px-4 mt-4 rounded" onClick={() => logout()}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}