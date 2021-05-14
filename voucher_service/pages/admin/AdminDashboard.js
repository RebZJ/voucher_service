import { useRouter } from "next/router";
import { AddNewServiceType } from "../../components/AddNewServiceType";

export default function AdminDashboard({ firebase }) {
  const router = useRouter();

  const logout = () => {
    firebase.auth().signOut();
    router.replace("/login");
  };


    return (
        <div className="justify-center flex min-h-screen ">
            <div className="pt-10">
                <h1>Admin Dashboard</h1>
                <p>Welcome admin! You are now signed in!</p>
                <AddNewServiceType />
                <button onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
}
