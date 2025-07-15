import React from 'react';

const Refund = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Refund & Cancellation Policy</h1>
      <p className="mb-4 leading-relaxed">
        All sales made through our website are final. We do not offer refunds or cancellations once a product or service has been purchased.
      </p>
      <p className="mb-4 leading-relaxed">
        Please make sure to read all product details carefully before making a payment. In case of any payment-related issues, feel free to contact our support team.
      </p>
      <p className="text-gray-600 font-semibold">📩 Email: <a href="mailto:vishubbkup@gmail.com" className="text-blue-600 hover:underline">vishubbkup@gmail.com</a></p>
    </div>
  );
};

export default Refund;
