import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const AddNewBookingForm = () => {
    const MISSING = '--';
    const [allData, setAllData] = useState(null);

    const [voucherType, setVoucherType] = useState(MISSING);
    const [deliveryType, setDeliveryType] = useState(MISSING);
    const [location, setLocation] = useState(MISSING);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [optionalMessage, setOptionalMessage] = useState('');
    const [notification, setNotification] = useState('');

    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref();

    useEffect(() => {
        async function getAllData() {
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
            console.log(data);
            setAllData(data);
            return data;
        }
        getAllData();
        }, []
    );

    function populateVoucherTypeData() {
        var list = [];
        for (let i in allData) {
            list.push(<option value={allData[i].name}> {allData[i].name} </option>);
        }
        return list;
    }

    function populateDeliveryTypeData(serviceName) {
        var list = [];
        if (serviceName == MISSING) {
            return;
        }
        for (let i in allData) {
            if (allData[i].name == serviceName) {
                for (let option of allData[i].deliveryOptions) {
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

    function populateLocationData(serviceName, deliveryMethod) {
        if (serviceName == MISSING || deliveryMethod == MISSING) {
            return <option value={MISSING}> {MISSING} </option>;
        }
        // delivery to MYD office
        if (deliveryMethod == "delivery") {
            return <option value="MYD"> MYD </option>;
        }
        // pickup from service location
        else if (deliveryMethod == "pickup") {
            for (let i in allData) {
                if (allData[i].name == serviceName) {
                    return <option value={allData[i].location}> {allData[i].location} </option>;
                }
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // don't create booking if required field is missing
        if (voucherType == MISSING || deliveryType == MISSING || location == MISSING || date == '' || time == '') {
            setNotification('Please fill out all required fields');
            setTimeout(() => {
                setNotification('')
            }, 2000);
            return
        }
        // otherwise, create a new booking
        else {
            await dbRef.child("voucherBookings").push().set({
                date: String(date),
                delivery: deliveryType,
                location: location,
                message: optionalMessage,
                status: "pending",
                time: String(time),
                uid: uid,
                voucherType: voucherType
            });
        }
        setVoucherType(MISSING);
        setDeliveryType(MISSING);
        setLocation(MISSING);
        setDate('');
        setTime('');
        setOptionalMessage('');
        setNotification('Booking created');
        setTimeout(() => {
            setNotification('')
        }, 2000)
    };
    return (
        <div>
            <h2>Add New Booking</h2> <br />
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
                    Booking Date<br />
                    <DatePicker selected={date}
                                dateFormat="dd/MM/yyyy"
                                onChange={target => setDate(target)}/>
                </div>
                <div>
                    Booking Time<br />
                    <DatePicker selected={time}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                onChange={target => setTime(target)}/>
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
