import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-2 mt-6">
      <div className="text-sm text-gray-400 text-center pb-3">
        <p>Contact us at support@localvoyage.lk</p>
      </div>
      <div className="flex items-center justify-center space-x-3">
        <a href="#" className="text-white" aria-label="Twitter">
          <FaTwitter size={20} />
        </a>
        <a href="#" className="text-white " aria-label="Facebook">
          <FaFacebookF size={20} />
        </a>
        <a href="#" className="text-white" aria-label="Instagram">
          <FaInstagram size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
