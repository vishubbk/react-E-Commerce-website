import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Privacy Policy</h1>
      <p className="mb-4 leading-relaxed">
        We respect your privacy. Any personal information shared with us, including name, email, phone, and address, will be kept confidential.
      </p>
      <p className="mb-4 leading-relaxed">
        We do not share or sell user data to third parties. Payment data is securely handled via our payment gateway partner (Razorpay).
      </p>
      <p className="mb-4 leading-relaxed">
        We may collect cookies and analytics to improve user experience. By using our website, you agree to this privacy policy.
      </p>
      <p className="text-gray-600 font-semibold">📅 Last Updated: July 2025</p>
    </div>
  );
};

export default Privacy;
