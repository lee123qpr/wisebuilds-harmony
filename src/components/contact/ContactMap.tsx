
import React from 'react';

const ContactMap = () => {
  return (
    <div className="w-full h-[400px] bg-gray-100">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0678233683474!2d-0.12456562318095982!3d51.51439447181045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ccab37652b%3A0x22d24b5fe8c1212a!2s71-75%20Shelton%20St%2C%20London%20WC2H%209JQ!5e0!3m2!1sen!2suk!4v1685546416827!5m2!1sen!2suk" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="BuildWise UK Office Location Map"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default ContactMap;
