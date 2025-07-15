import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-6 text-center text-gray-600 border-t mt-10">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-3 text-sm">
        <Link to="/terms" className="hover:text-blue-600 transition">Terms & Conditions</Link>
        <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
        <Link to="/refund" className="hover:text-blue-600 transition">Refund Policy</Link>
      </div>
      <p className="text-xs">&copy; 2025 Vishu-A. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
