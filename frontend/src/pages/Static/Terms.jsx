import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800"style={{
      fontFamily: '"Gidole", sans-serif',
      fontWeight: 400,
      fontStyle: "normal",
    }}>
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Terms & Conditions</h1>
      <p className="mb-4 leading-relaxed">
        By using this website, you agree to comply with and be bound by the following terms and conditions of use.
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>All content is for general informational purposes only.</li>
        <li>Unauthorized use of this site may give rise to a claim for damages.</li>
        <li>We may change or remove content at any time without notice.</li>
        <li>All payments are final and non-refundable unless stated otherwise.</li>
      </ul>
      <p className="text-gray-600 font-semibold">📩 For any queries: <a href="mailto:vishubbkup@gmail.com" className="text-blue-600 hover:underline">vishubbkup@gmail.com</a></p>
    </div>
  );
};

export default Terms;
