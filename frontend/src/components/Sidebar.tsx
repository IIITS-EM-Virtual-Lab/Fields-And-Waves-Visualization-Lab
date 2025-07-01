import { useLocation, Link } from "react-router-dom";

const sidebarData = [
  {
    topic: "Vector Algebra",
    icon: "/assets/vector-algebra.png",
    subtopics: [
      { name: "Scalars", path: "/scalars-and-vectors" },
      { name: "Addition", path: "/vector-addition" },
      { name: "Multiplication", path: "/vector-multiplication" },
      { name: "Triple Product", path: "/triple-product" },
    ],
  },
  {
    topic: "Vector Calculus",
    icon: "/assets/vector-calculus.png",
    subtopics: [
      { name: "Intro", path: "/vector-calculus-intro" },
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
      { name: "Del Operator", path: "/del-operator" },
      { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical"},
    ],
  },
  {
    topic: "Electrostatics",
    icon: "/assets/vector-calculus.png",
    subtopics: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      { name: "Field Operations", path: "/field-operations" },
      { name: "Electric Potential", path: "/electric-potential" },
      { name: "Gauss Law", path: "/gauss-law" },
      { name: "Electric Dipole", path: "/electric-dipole" },
    ],
  },
  {
    topic: "Maxwell Equations",
    icon: "/assets/maxwell.png",
    subtopics: [
      { name: "Gauss Law Contd", path: "/gauss-law-contd" },
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
  const location = useLocation();
  const activeSection = sidebarData.find(section =>
    section.subtopics.some(sub => sub.path === location.pathname)
  );

  const sectionToRender = activeSection || sidebarData[0];

  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={sectionToRender.icon}
          alt={sectionToRender.topic}
          className="w-14 h-14 rounded-full bg-white"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-900">{sectionToRender.topic}</h2>
          <p className="text-sm text-gray-500">{sectionToRender.subtopics.length} Units</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {sectionToRender.subtopics.map((sub, index) => {
          const isActive = location.pathname === sub.path;
          return (
            <li key={sub.name}>
              <Link
                to={sub.path}
                className={`block px-5 py-4 rounded-lg text-base font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span className="block text-sm uppercase text-gray-500 mb-1">
                  Unit {index + 1}
                </span>
                {sub.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Show Course Challenge only for Vector Calculus and Maxwell Equations */}
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
   <Link
  to={`/quizzes/module/${sectionToRender.topic.toLowerCase().replace(/\s+/g, '-')}/common`}
  className="text-blue-600 font-medium hover:underline"
>
  Start Course challenge
</Link>

  </div>
)}

    </div>
  );
};

export default Sidebar;
