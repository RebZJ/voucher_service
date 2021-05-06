import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB6HGsmuHBctypth2wm37gMsaS3CPIoidk",
    authDomain: "voucher-service-8caa7.firebaseapp.com",
    databaseURL: "https://voucher-service-8caa7-default-rtdb.firebaseio.com",
    projectId: "voucher-service-8caa7",
    storageBucket: "voucher-service-8caa7.appspot.com",
    messagingSenderId: "10848745503",
    appId: "1:10848745503:web:3a7b0a2ecd823c7e8cfd2a",
    measurementId: "G-S2BZHWZQHV"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch(err){
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)}
}
const fire = firebase;
export default fire;