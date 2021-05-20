import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
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
                <h1>Voucher-service</h1>
                <p>Welcome {userData ? userData.displayName : "unknown user"}! You are now signed in!</p>
                <Link href = "/user/AddNewBooking">
                    <a> Add New Booking</a>
                </Link> <br />
                <Link href = "/user/ViewPendingBookings">
                    <a> View Pending Bookings</a>
                </Link> <br />
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
}