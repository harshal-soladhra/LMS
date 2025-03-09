import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "../style/footer-style.css";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* About Library */}
        <div className="footer-section about">
          <h2>📚 Library Management System</h2>
          <p>
            Our Library Management System provides seamless access to books,
            digital resources, and study areas for students and researchers.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>🔗 Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#catalog">Profile</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-section contact">
          <h3>📞 Contact Us</h3>
          <p>Main Library, IITRAM University</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: iitramlibrary@gmail</p>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-section newsletter">
          <h3>📩 Stay Updated</h3>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="social-icons">
        <a href="#"><FaFacebook /></a>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaLinkedin /></a>
        <a href="#"><FaInstagram /></a>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};
