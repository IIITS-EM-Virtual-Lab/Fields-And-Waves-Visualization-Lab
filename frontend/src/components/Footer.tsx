// src/components/ui/Footer.tsx
import { Link } from "react-router-dom";
import logo from "/fwvlab.png"; 

const Footer = () => {
  return (
    <footer className="bg-[#f3f4f6] text-white text-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Top row: logo + website name and navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <span className="text-lg font-semibold text-[#0A204F]">Fields and Waves Visualization Lab</span>
          </div>
          <nav className="flex space-x-8 text-[#0A204F]">
            {/* <Link to="/about" className="hover:underline hover:text-[#0A204F]/80 transition-colors">
              About
            </Link> */}
            <Link to="/contact" className="hover:underline hover:text-[#0A204F]/80 transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Divider line */}
        <div className="border-t border-[#0A204F]/20 mb-4"></div>

        {/* Bottom row: copyright */}
        <div className="text-left text-[#0A204F]/80">
          © 2025 Fields And Waves Visualisation Lab, IIIT Sri City. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;