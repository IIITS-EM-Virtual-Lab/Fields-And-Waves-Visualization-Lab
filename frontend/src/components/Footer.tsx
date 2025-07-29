// src/components/ui/Footer.tsx
import { Link } from "react-router-dom";
import logo from "/fwvlab.png"; 

const Footer = () => {
  return (
    <footer className="bg-[#f3f4f6] text-xs sm:text-sm text-[#0A204F] w-full">
      <div className="max-w-full md:max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Top row: logo + website name and navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <img src={logo} alt="Logo" className="h-7 w-auto sm:h-8" />
            <span className="text-[13px] sm:text-md font-semibold">Fields and Waves Visualization Lab</span>
          </div>
          <nav className="flex flex-col sm:flex-row gap-2 sm:gap-0 space-x-0 sm:space-x-6 md:space-x-8 mt-2 sm:mt-0">
            <Link to="/feedback" className="hover:underline hover:text-[#0A204F]/80 transition-colors">
              Feedback Form
            </Link>
            <Link to="/team" className="hover:underline hover:text-[#0A204F]/80 transition-colors">
              Our team
            </Link>
          </nav>
        </div>

        {/* Divider line */}
        <div className="border-t border-[#0A204F]/20 mb-3 sm:mb-4"></div>

        {/* Bottom row: copyright */}
        <div className="text-center sm:text-left text-[#0A204F]/80 text-[12px] sm:text-xs">
          © 2025 Fields and Waves Visualization Lab
        </div>
      </div>
    </footer>
  );
};

export default Footer;
