// src/components/ui/Footer.tsx
import { Link } from "react-router-dom";
import logo from "/fwvlab.png"; 

const Footer = () => {
  return (
    <footer className="bg-[#f3f4f6] text-sm text-[#0A204F]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Top row: logo + website name and navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="text-md font-semibold">Fields and Waves Visualization Lab</span>
          </div>
          <nav className="flex space-x-6 sm:space-x-8">
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
        <div className="text-center sm:text-left text-[#0A204F]/80">
          © 2025 Fields and Waves Visualization Lab
        </div>
      </div>
    </footer>
  );
};

export default Footer;
