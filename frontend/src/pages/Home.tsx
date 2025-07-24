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
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
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
      { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical"},
      { name: "Differential Length, Area and Volume", path: "/vector-calculus-intro" },
      { name: "Del Operator", path: "/del-operator" }
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
  // {
  //   title: "Wave Propagation",
  //   icon: "/assets/wave.gif",
  //   topics: [
  //     { name: "Types of Waves", path: "/types-of-waves" },
  //     { name: "Wave Power Energy", path: "/wave-power-energy" },
  //     { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
  //     { name: "Wave Reflection", path: "/wave-reflection" },
  //   ],
  // },
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
  const [openStates, setOpenStates] = useState<boolean[]>(Array(modules.length).fill(true));

  const toggleDropdown = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center min-h-[60vh] lg:h-[70vh] px-4 sm:px-6 lg:px-12 py-8 lg:py-0">
          <div className="w-full lg:w-1/2 flex flex-col items-center order-2 lg:order-1 mt-6 lg:mt-[42px]">
            <img
              src="/JC Bose.jpeg"
              alt="Sir J.C. Bose"
              className="mb-3 rounded-md shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[75%] xl:max-w-[350px] 2xl:max-w-[450px] h-auto mx-auto"
            />
            <p className="text-sm sm:text-base text-gray-900 font-bold">Sir J.C. Bose</p>
          </div>

          <div className="w-full lg:w-1/2 space-y-3 order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-[2.4rem] font-serif leading-tight lg:leading-snug text-gray-900">
              For curious minds, passionate<br />educators, and future engineers.
            </h1>
            <p className="text-base sm:text-lg font-serif font-light text-gray-700">
              <span className="relative inline-block">
                Master electromagnetics — visually, interactively, and with purpose.
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-300"></span>
              </span>
            </p>
            <p className="text-sm sm:text-base lg:text-[1.05rem] font-light text-gray-700 max-w-md mx-auto lg:mx-0 leading-6 lg:leading-7">
              An open visualisation lab to explore, experiment, and understand the
              forces that shape our world.
            </p>
          </div>
        </div>


        {/* Modules Section */}
        <div className="bg-gray-100 py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-16 rounded-md mt-6 lg:mt-10 mx-4 sm:mx-8 lg:mx-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {modules.map((mod, index) => (
              <div key={index} className="w-full">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center justify-between w-full text-left pb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <img src={mod.icon} alt={mod.title} className="w-6 h-6" />
                    <h2 className="text-lg sm:text-xl font-serif font-semibold text-gray-800">
                      {mod.title}
                    </h2>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 flex-shrink-0 ${openStates[index] ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-200 ease-in-out overflow-hidden ${openStates[index] ? "max-h-screen pt-2" : "max-h-0 pt-0"}`}>
                  <ul className="ml-8 sm:ml-9 text-sm sm:text-base lg:text-[1.05rem] font-light text-gray-800 space-y-1 leading-6">
                    {mod.topics.map((topic, tidx) => (
                      <li key={tidx}>
                        <a href={topic.path} className="hover:underline hover:text-blue-600 block py-1 transition-colors">
                          {topic.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className={`border-gray-300 ${openStates[index] ? "mt-6 lg:mt-8" : "mt-0"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Why It Works Section */}
        <div className="my-16 sm:my-20 lg:my-28 px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-[2.6rem] font-serif font-medium text-gray-800 mb-12 sm:mb-14 lg:mb-16">
            Why It Works for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-20 text-center max-w-6xl mx-auto">
            {aboutData.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={card.image} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[56px] lg:h-[56px] mb-4 sm:mb-5 lg:mb-6" alt={card.title} />
                <h3 className="text-xl sm:text-2xl lg:text-[1.6rem] font-serif font-medium text-gray-900 mb-2 sm:mb-3">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-[0.9rem] text-gray-700 max-w-xs sm:max-w-sm lg:max-w-[20rem] leading-6 lg:leading-7">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* You Can Explore Section */}
        <div className="my-16 sm:my-20 lg:my-32 flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 lg:gap-20 px-4 sm:px-8 lg:px-20 lg:pl-32">
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 font-medium">
              Learners and Students
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[2.25rem] font-serif font-bold leading-tight lg:leading-snug">
              <span className="relative inline-block">
                <span className="bg-green-100 px-1">You</span> can explore physics like never before.
              </span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg lg:text-[1.1rem] font-light max-w-md mx-auto lg:mx-0 leading-6 lg:leading-7">
              Gain a strong conceptual foundation in vector algebra, field theory,
              Maxwell's equations, and wave propagation through simulations and expert-driven lessons.
            </p>
             <div className="pt-2 sm:pt-3 lg:pt-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base lg:text-[1rem] rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Dive into the Lab
                </button>
              </div>
          </div>
           <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://img.freepik.com/premium-vector/physics-learning-vector-illustration-featuring-students-exploring-electricity-magnetism-light-waves-forces-science-technology-exploration_2175-31406.jpg"
              alt="Learning Illustration"
              className="max-w-xs sm:max-w-sm lg:max-w-sm w-full h-auto"
            />
          </div>
        </div>

                

       <div className="text-center mt-16 border-t pt-10">
  <h2 className="text-2xl font-semibold text-gray-700 mb-6">Our Beloved Sponsors</h2>
  <div className="flex justify-center items-center gap-12 mb-10">
    <img
      src="/Sponser1.JPG"
      alt="Gyan Circle Ventures"
      className="h-24 w-auto object-contain"
    />
    <img
      src="/Sponser2.png"
      alt="Meity Startup Hub"
      className="h-24 w-auto object-contain"
    />
  </div>
</div>


      </main>
    </div>
  );
};

export default Home;