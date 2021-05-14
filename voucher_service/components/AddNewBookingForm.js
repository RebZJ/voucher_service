import React, { useState } from 'react';
import firebase from 'firebase';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const AddNewBookingForm = () => {
    const MISSING = '--';
    const [voucherType, setVoucherType] = useState('');
    const [deliveryType, setDeliveryType] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [optionalMessage, setOptionalMessage] = useState('');
    const [notification, setNotification] = useState('');

    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref().child("voucherBookings");


    const handleSubmit = async (event) => {
        event.preventDefault();

        // don't create booking if required field is missing
        if (voucherType == '' || deliveryType == MISSING || location == '' || date == MISSING || time == MISSING) {
            setNotification('Please fill out all required fields');
            setTimeout(() => {
                setNotification('')
            }, 2000);
            return
        }
        // otherwise, create a new booking
        else  {
            await dbRef.push().set({
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
        setVoucherType('');
        setDeliveryType(MISSING);
        setLocation('');
        setDate(MISSING);
        setTime(MISSING);
        setOptionalMessage('');
        setNotification('Information updated');
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
                    Delivery Type<br />
                    <select value={deliveryType} onChange={({target}) => setDeliveryType(target.value)}>
                        <option value="--"> -- </option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
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
