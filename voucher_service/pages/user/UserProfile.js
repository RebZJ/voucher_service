import { useRouter } from "next/router";

export default function UserProfile({firebase}) {
    const router = useRouter();

    const logout = () => {
        firebase.auth().signOut();
        router.replace('/login');
    }

    return (
        <div>
            <h1>Voucher-service</h1>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed in!</p>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
}