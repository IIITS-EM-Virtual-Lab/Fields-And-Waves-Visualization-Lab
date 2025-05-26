import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarData = [
  {
    topic: "Vector Algebra",
    subtopics: [
      { name: "Scalars", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    topic: "Vector Calculus",
    subtopics: [
      { name: "Intro", path: "/vector-calculus-intro" },
      { name: "Del Operator", path: "/del-operator" },
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
    ],
  },
  {
    topic: "Electrostatics",
    subtopics: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Dipole", path: "/electric-dipole" },
      { name: "Electric Potential", path: "/electric-potential" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      { name: "Field Operations", path: "/field-operations" },
      { name: "Gauss Law", path: "/gauss-law" },
    ],
  },
  {
    topic: "Maxwell Equations",
    subtopics: [
      { name: "Gauss Law Contd", path: "/gauss-law-contd" },
      { name: "Gauss Law Magnetism", path: "/gauss-law-magnetism" },
      { name: "Ampere Law", path: "/ampere-law" },
      { name: "Faraday Law", path: "/faraday-law" },
      { name: "Displacement Current", path: "/displacement-current" },
      { name: "Time Varying Potential", path: "/time-varying-potential" },
      { name: "EMF", path: "/transformer-motional-emf" },
    ],
  },
  {
    topic: "Wave Propagation",
    subtopics: [
      { name: "Types of Waves", path: "/types-of-waves" },
      { name: "Wave Power Energy", path: "/wave-power-energy" },
      { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
      { name: "Wave Reflection", path: "/wave-reflection" },
    ],
  },
];

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const location = useLocation();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-[#bbdfff] to-white border-r shadow-md fixed top-0 left-0 pt-20 z-40 overflow-y-auto">
      <ul className="p-4 space-y-4">
        {sidebarData.map((section, index) => (
          <li key={index} className="border-b pb-2">
            <button
                onClick={() => toggle(index)}
                className={`w-full text-left text-lg font-semibold text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-md transition duration-150 ${
                openIndex === index ? "bg-blue-100" : ""
            }`}
            >
            {section.topic}
            </button>

            <ul
              className={`mt-2 space-y-1 transition-all duration-300 ease-in-out ${
                openIndex === index ? "block" : "hidden"
              }`}
            >
              {section.subtopics.map((sub) => (
                <li key={sub.name}>
                  <Link
                    to={sub.path}
                    className={`block px-3 py-1 rounded-md text-sm font-medium ${
                      location.pathname === sub.path
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;