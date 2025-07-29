import { useLocation, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const sidebarData = [
  {
    topic: "Vector Algebra",
    icon: "/assets/vector-algebra.png",
    subtopics: [
      { name: "Scalars and Vectors", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    topic: "Vector Calculus",
    icon: "/assets/vector-calculus.png",
    subtopics: [
      
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
      { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical" },
      { name: "Differential Length, Area and Volume", path: "/vector-calculus-intro" },
      { name: "Del Operator", path: "/del-operator" }
    ],
  },
  {
    topic: "Electrostatics",
    icon: "/assets/vector-calculus.png",
    subtopics: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      // { name: "Field Operations", path: "/field-operations" },
      { name: "Electric Potential", path: "/electric-potential" },
      // { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole" },
    ],
  },
  {
    topic: "Maxwell Equations",
    icon: "/assets/maxwell.png",
    subtopics: [
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
    topic: "Wave Propagation",
    icon: "/assets/hero.png",
    subtopics: [
      { name: "Types of Waves", path: "/types-of-waves" },
      { name: "Wave Power Energy", path: "/wave-power-energy" },
      { name: "Plane Wave Analysis", path: "/plane-wave-analysis" },
      { name: "Wave Reflection", path: "/wave-reflection" },
    ],
  },
];

const Sidebar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  const moduleFromPath = location.pathname.startsWith("/module/")
  ? location.pathname.split("/")[2]
  : null;

const matchedSection = sidebarData.find(section =>
  moduleFromPath
    ? section.topic.toLowerCase().replace(/\s+/g, "-") === moduleFromPath
    : section.subtopics.some(sub => sub.path === location.pathname)
);

const sectionToRender = matchedSection || sidebarData[0];


  const modulePath = `/module/${sectionToRender.topic.toLowerCase().replace(/\s+/g, "-")}`;
  const isModuleActive = location.pathname.startsWith(modulePath);

  return (
    <div className="px-3 sm:px-6 py-5 sm:py-8 w-full max-w-full">
      <Link
        to={modulePath}
        className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 rounded transition ${
          isModuleActive
            ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
            : "hover:bg-blue-50 text-gray-900"
        }`}
      >
        <img
          src={sectionToRender.icon}
          alt={sectionToRender.topic}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white"
        />
        <div>
          <p className="text-base sm:text-lg font-bold">{sectionToRender.topic}</p>
          <p className="text-xs sm:text-sm text-gray-500">{sectionToRender.subtopics.length} Topics</p>
        </div>
      </Link>

      <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
        {sectionToRender.subtopics.map((sub, index) => {
          const isActive = location.pathname === sub.path;
          return (
            <li key={sub.name}>
              <Link
                to={sub.path}
                className={`block px-4 sm:px-5 py-2 sm:py-4 text-sm sm:text-base font-medium rounded transition ${
                  isActive
                    ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span className="block text-xs sm:text-sm uppercase text-gray-500 mb-0.5 sm:mb-1">
                  Topic {index + 1}
                </span>
                {sub.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {['vector-calculus', 'maxwell-equations'].includes(
        sectionToRender.topic.toLowerCase().replace(/\s+/g, '-')
      ) && (
        <div className="border p-3 sm:p-4 rounded-md shadow-sm bg-white text-xs sm:text-sm mt-2">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span className="text-base sm:text-lg">📘</span>
            <span className="uppercase text-[10px] sm:text-xs tracking-wider">Course Challenge</span>
          </div>
          <p className="text-gray-700 mb-1">
            Test your knowledge of the skills in this course.
          </p>
          {isAuthenticated ? (
            <Link
              to={`/quizzes/module/${sectionToRender.topic.toLowerCase().replace(/\s+/g, '-')}/common`}
              className="text-blue-600 font-medium hover:underline"
            >
              Start Course challenge
            </Link>
          ) : (
            <p className="text-[#a00032] text-xs">Login to unlock this challenge</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
