import React from "react";

const Shipping = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow rounded"style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
      <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
      <p className="mb-3">
        We process and ship all orders within 1–3 business days after successful payment.
      </p>
      <p className="mb-3">
        Delivery timelines may vary depending on your location. You will receive tracking details via email/SMS.
      </p>
      <p className="mb-3">
        If there is a delay in shipping or an issue with the product, contact us at <a href="mailto:vishubbkup@gmail.com" className="text-blue-600">vishubbkup@gmail.com</a>.
      </p>
      <p className="text-gray-500">Last Updated: July 2025</p>
    </div>
  );
};

export default Shipping;
