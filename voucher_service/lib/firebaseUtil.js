export async function checkIfAdmin(firebase) {
    const data = {key:null, value:null}
    const uid = firebase.auth().currentUser.uid

    const dbRef = firebase.database().ref();
    await dbRef.child("users").child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            data.key = snapshot.key;
            data.value = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.log(error);
    });
    return data;
}

export async function addUser(firebase) {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref().child("users").child(String(uid));
    await dbRef.set({
        pointsRemaining: 500,
        role: "User"
    });

    // Set the billing info
    await dbRef.child("billerInfo").set({
        billerEmailAddress: firebase.auth().currentUser.email,
        invoiceName: firebase.auth().currentUser.displayName
    });

    // Set the personal info
    await dbRef.child("personalInfo").set({
        contactNumber: "",
        email: firebase.auth().currentUser.email,
        name: firebase.auth().currentUser.displayName
    })
}

export async function checkUser(firebase) {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref().child("users").equalTo(String(uid));
    var hasUser = false;

    await dbRef.get().then((snapshot) => {
        if (snapshot.exists) {
            // User has been defined
            hasUser = true;
        } else {
            hasUser = false;
        }
    }).catch((error) => {
        console.log(error);
    });
    return hasUser;
}