import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const AddNewBookingForm = () => {
    const MISSING = '--';
    const [voucherServiceData, setVoucherServiceData] = useState(null);
    const [pointsRemaining, setPointsRemaining] = useState('');

    const [voucherType, setVoucherType] = useState(MISSING);
    const [deliveryType, setDeliveryType] = useState(MISSING);
    const [location, setLocation] = useState(MISSING);
    const [dateTime, setDateTime] = useState('');

    const [optionalMessage, setOptionalMessage] = useState('');
    const [notification, setNotification] = useState('');

    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref();

    useEffect(() => {
        async function getVoucherServiceData() {
            var data = {};
            await dbRef.child("voucherTypeService").child("voucherType").get().then((snapshot) => {
                if (snapshot.exists()) {
                    data = snapshot.val();

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
            setVoucherServiceData(data);
            return data;
        }
        async function getPointsRemaining() {
            var data = {};
            await dbRef.child("users").child(uid).get().then((snapshot) => {
                if (snapshot.exists()) {
                    data = snapshot.val();
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
            setPointsRemaining(data.pointsRemaining);
        }
        getVoucherServiceData();
        getPointsRemaining();
        }, []
    );
    // shows the names of all voucher services available, along with the number of points needed for each one
    function populateVoucherTypeData() {
        var list = [];
        for (let i in voucherServiceData) {
            list.push(<option value={voucherServiceData[i].name}> {voucherServiceData[i].name + " - " + voucherServiceData[i].points + " points"} </option>);
        }
        return list;
    }
    // shows all possible delivery options for a given voucher service
    function populateDeliveryTypeData(serviceName) {
        var list = [];
        if (serviceName == MISSING) {
            return;
        }
        for (let i in voucherServiceData) {
            if (voucherServiceData[i].name == serviceName) {
                for (let option of voucherServiceData[i].deliveryOptions) {
                    if (option == "1") {
                        list.push(<option value="delivery">delivery</option>)
                    } else if (option == "2") {
                        list.push(<option value="pickup">pickup</option>)
                    }
                }
            }
        }
        return list;
    }
    // shows the location options available for a given voucher service and delivery method
    function populateLocationData(serviceName, deliveryMethod) {
        if (serviceName == MISSING || deliveryMethod == MISSING) {
            return;
        }
        // delivery to MYD office
        if (deliveryMethod == "delivery") {
            return <option value="MYD"> MYD </option>;
        }
        // pickup from service location
        else if (deliveryMethod == "pickup") {
            for (let i in voucherServiceData) {
                if (voucherServiceData[i].name == serviceName) {
                    return <option value={voucherServiceData[i].location}> {voucherServiceData[i].location} </option>;
                }
            }
        }
    }
    // dateTime is formatted like "Wed May 19 2021 00:00:00 GMT+1000 (Australian Eastern Standard Time)"
    function parseDateTime() {
        const splitDateTime = String(dateTime).split(" ");
        const day = splitDateTime[2];
        const monthNumbers = {
            "Jan": "01",
            "Feb": "02",
            "Mar": "03",
            "Apr": "04",
            "May": "05",
            "Jun": "06",
            "Jul": "07",
            "Aug": "08",
            "Sep": "09",
            "Oct": "10",
            "Nov": "11",
            "Dec": "12"
        };
        const month = monthNumbers[splitDateTime[1]];
        const year = splitDateTime[3];
        const splitTime = splitDateTime[4].split(":");
        const time = splitTime[0] + ":" + splitTime[1] + " " + splitDateTime[5];
        const date = day + "/" + month + "/" + year;
        return [date, time];
    }
    // returns true if user points could be redeemed for voucher service and updated successfully, or false if user has insufficient points
    async function updateUserPoints(serviceName) {
        var pointsNeeded = 0;
        for (let i in voucherServiceData) {
            if (voucherServiceData[i].name == serviceName) {
                pointsNeeded = voucherServiceData[i].points;
            }
        }
        const newPoints = parseFloat(pointsRemaining) - parseFloat(pointsNeeded);
        if (newPoints < 0) {
            return false;
        }
        else {
            await dbRef.child("users").child(uid).update({pointsRemaining: newPoints});
            setPointsRemaining(String(newPoints));
            return true;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // don't create booking if required field is missing
        if (voucherType == MISSING || deliveryType == MISSING || location == MISSING || dateTime == '') {
            setNotification('Please fill out all required fields');
            setTimeout(() => {
                setNotification('')
            }, 2000);
            return
        }
        // if points could not be updated successfully, it means that the user doesn't have enough points remaining
        else if (!(await updateUserPoints(voucherType))) {
            setNotification('Not enough points remaining to create booking for selected service');
            setTimeout(() => {
                setNotification('')
            }, 2000);
            return
        }
        // create a booking if user has enough points
        else {
            const [date, time] = parseDateTime();
            await dbRef.child("voucherBookings").push().set({
                date: date,
                delivery: deliveryType,
                location: location,
                message: optionalMessage,
                status: "pending",
                time: time,
                uid: uid,
                voucherType: voucherType
            });
        }
        setVoucherType(MISSING);
        setDeliveryType(MISSING);
        setLocation(MISSING);
        setDateTime('');
        setOptionalMessage('');
        setNotification('Booking created');
        setTimeout(() => {
            setNotification('')
        }, 2000)
    };
    return (
        <div>
            <h2><b><u>Add New Booking</u></b></h2> <br />
            <h3><b>Points Remaining: {pointsRemaining}</b></h3> <br />
            {notification}
            <form onSubmit={handleSubmit}>
                <div>
                    Voucher Services<br />
                    <select value={voucherType} onChange={({target}) => setVoucherType(target.value)}>
                        <option value={MISSING}> {MISSING} </option>
                        {populateVoucherTypeData()}
                    </select>
                </div> <br />
                <div>
                    Delivery Type<br />
                    <select value={deliveryType}
                            onChange={({target}) => setDeliveryType(target.value)}>
                        <option value={MISSING}> {MISSING} </option>
                        {populateDeliveryTypeData(voucherType)}
                    </select>
                </div> <br />
                <div>
                    Location<br />
                    <select value={location}
                            onChange={({target}) => setLocation(target.value)}>
                        <option value={MISSING}> {MISSING} </option>
                        {populateLocationData(voucherType, deliveryType)}
                    </select>
                </div> <br />
                <div>
                    Booking Date and Time<br />
                    <DatePicker selected={dateTime}
                                dateFormat="dd/MM/yyyy h:mm aa"
                                showTimeSelect
                                timeCaption="Time"
                                onChange={target => setDateTime(target)}/>
                </div>

                <div>
                    Optional Message<br />
                    <textarea value={optionalMessage}
                              onChange={({target}) => setOptionalMessage(target.value)} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
};

export default AddNewBookingForm;
