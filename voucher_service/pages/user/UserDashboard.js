import { useRouter } from "next/router";

export default function UserDashboard({firebase}) {
    const router = useRouter();

    const logout = () => {
        firebase.auth().signOut();
        router.replace('/login');
    }

    return (
        <div className="justify-center flex min-h-screen ">
            <div className="pt-10">
                <h1>Voucher-service</h1>
                <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed in!</p>
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
}