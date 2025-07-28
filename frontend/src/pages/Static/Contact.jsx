import React from "react";

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow rounded"style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-3">Have questions? Reach out to us!</p>
      <p>Email: <a href="mailto:vishubbkup@gmail.com" className="text-blue-600">vishubbkup@gmail.com</a></p>
      <p>Phone: +91-9452900378</p>
      <p className="text-sm text-gray-500 mt-4">Our team will get back to you within 24–48 hours.</p>
    </div>
  );
};

export default Contact;
