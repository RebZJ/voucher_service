export async function getAdminUID(firebase) {
    const data = {key:null, value:null};

    const dbRef = firebase.database().ref();
    await dbRef.child("Admin").child("Admin").get().then((snapshot) => {
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

export async function updateUserInfo(firebase) {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref().child("users").child(String(uid));

    // update personal info (can't update email)
    await dbRef.child("personalInfo").update({
        contactNumber: firebase.auth().currentUser.contactNumber,
        name: firebase.auth().currentUser.displayName
    });

    // update billing info
    await dbRef.child("billerInfo").update({
        billerEmailAddress: firebase.auth().currentUser.billerEmailAddress,
        invoiceName: firebase.auth().currentUser.displayName
    });
}
