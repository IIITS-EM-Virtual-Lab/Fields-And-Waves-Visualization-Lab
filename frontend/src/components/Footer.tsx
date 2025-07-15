// src/components/ui/Footer.tsx
import { Link } from "react-router-dom";
import logo from "/logo.png"; 

const Footer = () => {
  return (
    <footer className="bg-[#3b0e17] text-white text-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Top row: logo + website name and navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <span className="text-lg font-semibold text-white">Fields and Waves Visualization Lab</span>
          </div>
          <nav className="flex space-x-8">
            <Link to="/about" className="hover:underline hover:text-white/80 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:underline hover:text-white/80 transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Divider line */}
        <div className="border-t border-white/20 mb-4"></div>

        {/* Bottom row: copyright */}
        <div className="text-left text-white/80">
          © 2025 Fields And Waves Visualisation Lab, IIIT Sri City. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;