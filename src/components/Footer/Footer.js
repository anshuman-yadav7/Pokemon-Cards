import React from "react";
import './Footer.css';
import { AiFillHeart } from "react-icons/ai";

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-content">
                <p className="footer-title">Made with</p>
                <span className="heart-icon"><AiFillHeart/></span>
            </div>
        </div>
    )
}