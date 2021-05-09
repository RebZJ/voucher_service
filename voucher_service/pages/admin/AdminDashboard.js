import { useRouter } from "next/router";

export default function AdminDashboard({ firebase }) {
  const router = useRouter();

  const logout = () => {
    firebase.auth().signOut();
    router.replace("/login");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome admin! You are now signed in!</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
