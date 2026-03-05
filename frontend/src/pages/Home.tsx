import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
const modules = [
  {
    title: "Vector Algebra",
    icon: "/assets/vector-algebra.png",
    topics: [
      { name: "Scalars and Vectors", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    title: "Electrostatics",
    icon: "/assets/electrostatics.png",
    topics: [
      { name: "Intro", path: "/electrostatics-intro" },
      {
        name: "Electric Field & Flux",
        path: "/electric-field-and-flux-density",
      },
      // { name: "Field Operations", path: "/field-operations" },
      { name: "Electric Potential", path: "/electric-potential" },
      // { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole" },
    ],
  },
  {
    title: "Vector Calculus",
    icon: "/assets/vector-calculus.png",
    topics: [
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
      {
        name: "Cartesian, Cylindrical and Spherical",
        path: "/cartesian-cylindrical-spherical",
      },
      {
        name: "Differential Length, Area and Volume",
        path: "/vector-calculus-intro",
      },
      { name: "Del Operator", path: "/del-operator" },
    ],
  },
  {
    title: "Maxwell Equations",
    icon: "/assets/maxwell.png",
    topics: [
      { name: "Gauss Law", path: "/gauss-law-contd" },
      { name: "Gauss Law Magnetism", path: "/gauss-law-magnetism" },
      { name: "Faraday Law", path: "/faraday-law" },
      { name: "Ampere Law", path: "/ampere-law" },
      { name: "Displacement Current", path: "/displacement-current" },
      { name: "Time Varying Potential", path: "/time-varying-potential" },
      { name: "EMF", path: "/transformer-motional-emf" },
    ],
  },
  {
    title: "Wave Propagation",
    icon: "/assets/wave.gif",
    topics: [
      { name: "Types of Waves", path: "/types-of-waves" },
      { name: "Wave Power Energy", path: "/wave-power-energy" },
      { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
      { name: "Wave Reflection", path: "/wave-reflection" },
    ],
  },
  {
    title: "Transmission Lines",
    icon: "/assets/transmission-lines.png",
    topics: [
      { name: "Types of Transmission Line", path: "/types-of-transmission-line" },
      { name: "Characteristic Impedance", path: "/characteristic-impedance" },
      { name: "Smith Chart", path: "/smith-chart" },
    ],
  },
];

const aboutData = [
  {
    image: "https://cdn-icons-png.flaticon.com/128/10789/10789827.png",
    title: "Expert-Crafted Learning",
    description:
      "Learn with content and quizzes carefully designed by subject matter experts to strengthen language and conceptual foundations.",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/128/12328/12328092.png",
    title: "Interactive Simulations",
    description:
      "Engage with custom-built, hands-on simulations designed to visualize and experience physics concepts in real-time.",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/128/18287/18287548.png",
    title: "Insightful Dashboards",
    description:
      "Students can track progress and learning trends through a personalized dashboard, offering clear visual feedback on performance.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(modules.length).fill(true),
  );

  const toggleDropdown = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center min-h-[60vh] lg:h-[70vh] px-4 sm:px-6 lg:px-12 py-8 lg:py-0">
          <div className="w-full lg:w-1/2 flex flex-col items-center order-2 lg:order-1 mt-6 lg:mt-[42px]">
            <img
              src="/JC Bose.jpeg"
              alt="Sir J.C. Bose"
              className="mb-3 rounded-md shadow-md w-56 sm:w-64 lg:w-60 h-auto mx-auto grayscale hover:grayscale-0 transition-all duration-500"
            />
            <p className="text-sm sm:text-base text-gray-900 font-bold tracking-wide">
              Sir J.C. Bose
            </p>
          </div>

          <div className="w-full lg:w-1/2 space-y-3 order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-serif leading-tight lg:leading-snug text-gray-900">
              For curious minds, passionate
              <br />
              educators, and future engineers.
            </h1>
            <p className="text-base sm:text-lg font-serif font-light text-gray-700">
              <span className="relative inline-block">
                Master electromagnetics — visually, interactively, and with
                purpose.
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-300"></span>
              </span>
            </p>
            <p className="text-sm sm:text-base lg:text-[1.05rem] font-light text-gray-700 max-w-md mx-auto lg:mx-0 leading-6 lg:leading-7">
              An open visualisation lab to explore, experiment, and understand
              the forces that shape our world.
            </p>
          </div>
        </div>

        {/* Modules Section */}
        <div className="mt-12 mx-4 sm:mx-8 lg:mx-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-medium text-gray-800">Explore Modules</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((mod, index) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden h-[340px]"
              >
                {/* Card Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center gap-4 shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 p-2">
                    <img src={mod.icon} alt={mod.title} className="w-full h-full object-contain" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-tight">
                    {mod.title}
                  </h2>
                </div>

                {/* Card Body - Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  <ul className="space-y-1">
                    {mod.topics.map((topic, tidx) => (
                      <li key={tidx}>
                        <Link
                          to={topic.path}
                          className="flex items-center justify-between px-4 py-3 mx-2 rounded-lg group transition-colors hover:bg-blue-50"
                        >
                          <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700 transition-colors">
                            {topic.name}
                          </span>
                          <svg 
                            className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual fade for scrolling indication (optional aesthetic touch) */}
                <div className="h-4 bg-gradient-to-t from-white to-transparent shrink-0 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Why It Works Section */}
        <div className="my-14 sm:my-20 lg:my-18 px-4 sm:px-6 lg:px-8 bg-gray-50 py-16">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[2.6rem] font-serif font-medium text-gray-800 mb-12 sm:mb-14 lg:mb-16">
            Why It Works for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-20 text-center max-w-6xl mx-auto">
            {aboutData.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <img
                    src={card.image}
                    className="w-10 h-10"
                    alt={card.title}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[1.4rem] font-serif font-medium text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* You Can Explore Section */}
        <div className="my-16 sm:my-20 lg:my-32 flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 lg:gap-20 px-4 sm:px-8 lg:px-20 lg:pl-32">
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-blue-600 font-bold">
              Learners and Students
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[2.25rem] font-serif font-bold leading-tight lg:leading-snug">
              <span className="relative inline-block">
                <span className="bg-blue-100 text-blue-800 px-2 rounded mr-1">You</span> can explore
                physics like never before.
              </span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg lg:text-[1.1rem] font-light max-w-md mx-auto lg:mx-0 leading-6 lg:leading-7">
              Gain a strong conceptual foundation in vector algebra, field
              theory, Maxwell's equations, and wave propagation through
              simulations and expert-driven lessons.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-gray-900 text-white px-6 py-3 text-base rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Dive into the Lab
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://img.freepik.com/premium-vector/physics-learning-vector-illustration-featuring-students-exploring-electricity-magnetism-light-waves-forces-science-technology-exploration_2175-31406.jpg"
              alt="Learning Illustration"
              className="max-w-xs sm:max-w-md w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Key Supporters */}
        <div className="my-16 sm:my-20 lg:my-28 px-4 sm:px-6 lg:px-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-serif font-medium text-gray-800 mb-12 sm:mb-16">
            Key Supporters
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-14 lg:gap-20 mb-24">
            <img
              src="/Sponser1.JPG"
              alt="Gyan Circle Ventures"
              className="h-24 sm:h-28 lg:h-32 w-auto object-contain"
            />
            <img
              src="/IIIT_Sri_City_Logo.png"
              alt="IIIT Sri City"
              className="h-24 sm:h-28 lg:h-32 w-auto object-contain"
            />
            <img
              src="/Sponser2.png"
              alt="Meity Startup Hub"
              className="h-24 sm:h-28 lg:h-32 w-auto object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
