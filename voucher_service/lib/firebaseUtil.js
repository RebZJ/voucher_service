export async function getAdminUID(firebase) {
    const data = {key:null, value:null}

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
