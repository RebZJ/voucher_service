import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

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
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
}