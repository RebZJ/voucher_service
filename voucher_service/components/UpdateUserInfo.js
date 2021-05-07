import React, { useState } from 'react';
import firebase from 'firebase';



const UpdateUserInfo = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [billerEmailAddress, setBillerEmailAddress] = useState('');
    const [invoiceName, setInvoiceName] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const uid = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref().child("users").child(String(uid));

        // don't update database if form is empty
        if (contactNumber == '' && displayName == '' && billerEmailAddress == '' && invoiceName == '') {
            setNotification('No new information submitted');
            setTimeout(() => {
                setNotification('')
            }, 2000)
            return
        }

        // update personal info (not sure about updating email yet? unsure how this is handled for google account logins)
        if (contactNumber != '') {
            await dbRef.child("personalInfo").update({
                contactNumber: contactNumber,
            });
        }
        if (displayName != '') {
            await dbRef.child("personalInfo").update({
                name: displayName
            });
            await firebase.auth().currentUser.updateProfile({
                displayName: displayName,
            })
        }

        // update billing info
        if (billerEmailAddress != '') {
            await dbRef.child("billerInfo").update({
                billerEmailAddress: billerEmailAddress,
            });
        }
        if (invoiceName != '') {
            await dbRef.child("billerInfo").update({
                invoiceName: invoiceName
            });
        }
        setContactNumber('');
        setDisplayName('');
        setBillerEmailAddress('');
        setInvoiceName('');
        setNotification('Information updated');
        setTimeout(() => {
            setNotification('')
        }, 2000)
    };


    return (
        <div>
            <h2>Update User Information</h2>
            {notification}

            <form onSubmit={handleSubmit}>
                <div>
                    Contact Number<br />
                    <textarea value={contactNumber}
                           onChange={({target}) => setContactNumber(target.value)} />
                </div>
                <div>
                    Display Name<br />
                    <textarea value={displayName}
                              onChange={({target}) => setDisplayName(target.value)} />
                </div>
                <div>
                    Biller Email Address<br />
                    <textarea value={billerEmailAddress}
                              onChange={({target}) => setBillerEmailAddress(target.value)} />
                </div>
                <div>
                    Invoice Name<br />
                    <textarea value={invoiceName}
                              onChange={({target}) => setInvoiceName(target.value)} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
};
export default UpdateUserInfo;