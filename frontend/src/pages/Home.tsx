import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const modules = [
  {
    title: "Vector Algebra",
    icon: "/assets/vector-algebra.png",
    topics: [
      { name: "Scalars", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    title: "Vector Calculus",
    icon: "/assets/vector-calculus.png",
    topics: [
      { name: "Intro", path: "/vector-calculus-intro" },
      { name: "Del Operator", path: "/del-operator" },
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
    ],
  },
  {
    title: "Electrostatics",
    icon: "/assets/electrostatics.png",
    topics: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Dipole", path: "/electric-dipole" },
      { name: "Electric Potential", path: "/electric-potential" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      { name: "Field Operations", path: "/field-operations" },
      { name: "Gauss Law", path: "/gauss-law" },
    ],
  },
  {
    title: "Maxwell Equations",
    icon: "/assets/maxwell.png",
    topics: [
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
    title: "Wave Propagation",
    icon: "/assets/wave.gif",
    topics: [
      { name: "Types of Waves", path: "/types-of-waves" },
      { name: "Wave Power Energy", path: "/wave-power-energy" },
      { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
      { name: "Wave Reflection", path: "/wave-reflection" },
    ],
  },
];

const aboutData = [
  {
    image: "/assets/about/1.svg",
    title: "Personalized learning",
    description:
      "Students practice at their own pace, first filling in gaps in their understanding and then accelerating their learning.",
  },
  {
    image: "/assets/about/2.svg",
    title: "Hands-on Experiments",
    description:
      "Perform virtual experiments to understand the principles of electromagnetics better.",
  },
  {
    image: "/assets/about/3.svg",
    title: "Trusted content",
    description:
      "Learn from experts in the field with curated content and explanations.",
  },
];

const Home = () => {
  const [openStates, setOpenStates] = useState<boolean[]>(Array(modules.length).fill(true));
  const navigate = useNavigate();

  const toggleDropdown = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <main className="px-12">
      {/* Hero Section */}
      <div className="flex items-center h-[70vh]">
        <div className="w-1/2 flex justify-center mt-[42px]">
          <img
            src="https://swarajya.gumlet.io/swarajya/2022-04/d1031280-01e2-4ee6-83fc-1410b5eec47b/electromagnetic_waves.png?w=610&q=50&compress=true&format=auto"
            alt="Electromagnetic Waves"
            className="rounded-md shadow-md w-[80%] h-auto mx-auto"
          />
        </div>
        <div className="w-1/2 pl-10 space-y-3">
          <h1 className="text-[2.4rem] font-serif font-semibold leading-snug text-gray-900">
            For curious minds, passionate educators, and future engineers.
          </h1>
          <p className="text-lg font-serif font-light text-gray-700">
            <span className="relative inline-block">
              Master electromagnetics — visually, interactively, and with purpose.
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-300"></span>
            </span>
          </p>
          <p className="text-md text-gray-600 max-w-md">
            An open visualisation lab to explore, experiment, and understand the
            forces that shape our world.
          </p>
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-gray-100 py-10 px-16 rounded-md mt-10 mx-20">
        <div className="grid md:grid-cols-2 gap-10">
          {modules.map((mod, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => toggleDropdown(index)}
                className="flex items-center justify-between w-full text-left pb-3"
              >
                <div className="flex items-center gap-3">
                  <img src={mod.icon} alt={mod.title} className="w-6 h-6" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {mod.title}
                  </h2>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${openStates[index] ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-200 ease-in-out overflow-hidden ${openStates[index] ? "max-h-screen pt-2" : "max-h-0 pt-0"}`}>
                <ul className="ml-9 text-base text-gray-800 space-y-1">
                  {mod.topics.map((topic, tidx) => (
                    <li key={tidx}>
                      <Link to={topic.path} className="hover:underline">
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className={`border-gray-300 ${openStates[index] ? "mt-4" : "mt-0"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Why It Works Section */}
<div className="my-32 px-8">
  <h2 className="text-center text-[2.5rem] font-serif font-bold mb-14">Why It Works for You</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
    {aboutData.map((card, index) => (
      <div key={index} className="flex flex-col items-center">
        <img src={card.image} className="w-16 h-16 mb-4" alt={card.title} />
        <h3 className="text-[1.25rem] font-serif font-semibold mb-2">{card.title}</h3>
        <p className="text-gray-700 leading-relaxed text-[1.1rem] max-w-sm">{card.description}</p>
      </div>
    ))}
  </div>
</div>

{/* You can explore section */}
<div className="my-32 flex flex-col md:flex-row items-center justify-between gap-20 px-20">
  <div className="w-full md:w-1/2 space-y-6">
    <p className="text-sm uppercase tracking-wider text-gray-500 font-medium">
      Learners and Students
    </p>
    <h2 className="text-[2.25rem] font-serif font-bold leading-snug">
      <span className="relative inline-block">
        <span className="bg-green-100 px-1">You</span> can explore physics like never before.
      </span>
    </h2>
    <p className="text-gray-700 text-[1.1rem] max-w-md">
      Gain a strong conceptual foundation in vector algebra, field theory,
      Maxwell's equations, and wave propagation through simulations and expert-driven lessons.
    </p>
    <Link to="/auth">
      <Button className="bg-blue-600 text-white px-6 py-3 text-[1rem] rounded hover:bg-blue-700 mt-3">
        Dive into the Lab
      </Button>
    </Link>
  </div>
  <div className="w-full md:w-1/2 flex justify-center">
    <img
      src="https://img.freepik.com/premium-vector/physics-learning-vector-illustration-featuring-students-exploring-electricity-magnetism-light-waves-forces-science-technology-exploration_2175-31406.jpg"
      alt="Learning Illustration"
      className="max-w-sm"
    />
  </div>
</div>

    </main>
  );
};

export default Home;
