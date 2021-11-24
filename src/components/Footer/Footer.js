import React from "react";
import './Footer.css';
import { AiFillHeart } from "react-icons/ai";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

function Footer() {
    return (
        <div className="footer">
            <p className="nav-title">Made with <AiFillHeart/></p>
            <div className="up-icon"><BsFillArrowUpCircleFill /></div>
        </div>
    )
}

export default Footer;