import { useLocation, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const sidebarData = [
  {
    topic: "Vector Algebra",
    icon: "/assets/vector-algebra.png",
    subtopics: [
      { name: "Scalars and Vectors", path: "/scalars-and-vectors", quizPath: "/quiz/vector-algebra/scalars" },
      { name: "Addition", path: "/vector-addition", quizPath: "/quiz/vector-algebra/addition" },
      { name: "Multiplication", path: "/vector-multiplication", quizPath: "/quiz/vector-algebra/multiplication" },
      { name: "Triple Product", path: "/triple-product", quizPath: "/quiz/vector-algebra/triple-product" },
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
      { name: "Intro", path: "/electrostatics-intro", quizPath: "/quiz/electrostatics/coulombs-law" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density", quizPath: "/quiz/electrostatics/electric-flux" },
      { name: "Field Operations", path: "/field-operations", quizPath: "/quiz/electrostatics/gradient" },
      { name: "Electric Potential", path: "/electric-potential", quizPath: "/quiz/electrostatics/electric-potential" },
      // { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole", quizPath: "/quiz/electrostatics/electric-dipole" },
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
  {
  topic: "Transmission Lines",
  icon: "/assets/transmission-lines.png",
  subtopics: [
    { name: "Types of Transmission Line", path: "/types-of-transmission-line", quizPath: "/quiz/transmission-lines/types-of-transmission-line" },
    { name: "Characteristic Impedance", path: "/characteristic-impedance" },
    { name: "Smith Chart", path: "/smith-chart" },
    { name: "Quarter Wave Transformer", path: "/quarter-wave-transformer", quizPath: "/quiz/transmission-lines/types-of-transmission-line" },
    { name: "Single Stub Tuner", path: "/single-stub-tuner", quizPath: "/quiz/transmission-lines/single-stub-tuner" },
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
    <div className="px-6 py-8">
      <Link
        to={modulePath}
        className={`flex items-center gap-4 mb-4 px-4 py-3 transition ${
          isModuleActive
            ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
            : "hover:bg-blue-50 text-gray-900"
        }`}
      >
        <img
          src={sectionToRender.icon}
          alt={sectionToRender.topic}
          className="w-11 h-11 rounded-full bg-white"
        />
        <div>
          <p className="text-lg font-bold">{sectionToRender.topic}</p>
          <p className="text-sm text-gray-500">{sectionToRender.subtopics.length} Topics</p>
        </div>
      </Link>

      <ul className="space-y-2 mb-6">
        {sectionToRender.subtopics.map((sub, index) => {
          const isActive = location.pathname === sub.path;
          return (
            <li key={sub.name}>
              <Link
                to={sub.path}
                className={`block px-5 pt-4 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                } ${sub.quizPath ? "pb-2" : "pb-4"}`}
              >
                <span className="block text-sm uppercase text-gray-500 mb-1">
                  Topic {index + 1}
                </span>
                {sub.name}
              </Link>
              {sub.quizPath && (
                <div
                  className={`px-5 pb-4 ${
                    isActive
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {isAuthenticated ? (
                    <Link
                      to={sub.quizPath}
                      className="inline-flex rounded-md border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      Take Test
                    </Link>
                  ) : (
                    <p className="text-xs font-medium text-[#a00032]">
                      Login to take the test
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {['vector-calculus', 'maxwell-equations'].includes(
        sectionToRender.topic.toLowerCase().replace(/\s+/g, '-')
      ) && (
        <div className="border p-4 rounded-md shadow-sm bg-white text-sm">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span className="text-lg">📘</span>
            <span className="uppercase text-xs tracking-wider">Course Challenge</span>
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
            <p className="text-[#a00032] text-s">Login to unlock this challenge</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
