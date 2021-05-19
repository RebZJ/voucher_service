
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext, useEffect } from "react";
import { faBars, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import anim from "../styles/Animations.module.css";
import Link from "next/link";
import React from "react";


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            style={{
                background:
                    "linear-gradient(180deg, rgb(191, 219, 254) 0%, rgba(255,255,255,0) 100%)",
            }}
            className={
                menuOpen == false
                    ? `fixed w-full h-12 flex z-30`
                    : `flex z-30 fixed w-full transition-height duration-500 ease-in-out min-h-screen `
            }
            onClick={() => (menuOpen == true ? setMenuOpen(false) : null)}>
            <div
                className={
                    menuOpen
                        ? `absolute  w-full h-full flex justify-end  ${anim.slideInRight}`
                        : `hidden`
                }
            // className={menuOpen ? : `hidden`}
            >
                <div
                    style={{ background: "rgb(100, 100, 255)" }}
                    className="h-full w-72 flex justify-center z-50 relative">
                    <div className="flex flex-col  w-full">
                        <button
                            className={`h-10 w-auto flex justify-end rounded-sm text-white font-bold p-4 focus:outline-none`}
                            onClick={() => { }}>
                            <FontAwesomeIcon
                                className="h-4"
                                icon={faWindowClose}></FontAwesomeIcon>
                        </button>
                        <div className="flex flex-box justify-center my-4">
                            Voucher Service
                        </div>
                        <Links hg="h-10" pad="px-1" />
                    </div>
                </div>
            </div>
            {/*Socials and hamburger */}
            <div
                className={
                    menuOpen
                        ? `hidden`
                        : `p-4 w-full flex flex-row justify-between h-20 z-40 ${anim.fadeIn}`
                }>
                <div className={`w-60 relative z-50 flex flex-row font-bold italic`}>
                    Voucher Service
                </div>
                <button
                    onClick={() => {
                        menuOpen == false ? setMenuOpen(true) : setMenuOpen(false);
                    }}
                    className="text-black focus:outline-none h-4 md:hidden block">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="hidden md:flex flex-row justify-evenly">
                    <Links hg="h-1" pad="px-5"></Links>
                </div>
            </div>
        </div>
    );
}

function Links(props) {

    var buttonStyle = `transition duration-500 ease-in-out focus:outline-none hover: transform hover:-translate-y-1 hover:scale-110`;
    return (
        <React.Fragment>
            <Link href="/">
                <button
                    className={`${props.hg} ${props.pad} w-auto rounded-sm text-black font-bold ${buttonStyle}`}
                    onClick={() => console.log("thingo")}>
                    Home
                </button>
            </Link>

            <Link href="/admin/AdminDashboard">
                <button
                    className={`${props.hg} ${props.pad} w-auto rounded-sm text-black font-bold ${buttonStyle}`}
                    onClick={() => console.log("thingo")}>
                    Admin
                </button>
            </Link>
            <Link href="/login">
                <button
                    className={`${props.hg} ${props.pad} w-auto rounded-sm text-black font-bold ${buttonStyle}`}
                    onClick={() => console.log("thingo")}>
                    Login
                </button>
            </Link>

        </React.Fragment>
    );
}

export default function Layout(props) {
    var buttonStyle = `transition duration-500 ease-in-out focus:outline-none hover: transform hover:-translate-y-1 hover:scale-110`;


    return (
        <div className="min-h-full">
            <Navbar /><div >
                {props.children}
            </div>
            <div className="flex flex-col justify-center w-full bg-black items-center  pt-10 pb-2">

                <br></br>
                <div className="flex flex-row justify-center text-white font-sans pt-6 ">
                    Made by SwenTeam
                </div>
            </div>
        </div>
    );
}
