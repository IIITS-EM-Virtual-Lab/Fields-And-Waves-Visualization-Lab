import { useLocation, Link } from "react-router-dom";

const sidebarData = [
  {
    topic: "Electrostatics",
    icon: "/assets/electrostatics.png",
    subtopics: [
      { name: "Intro", path: "/electrostatics-intro" },
      { name: "Electric Dipole", path: "/electric-dipole" },
      { name: "Electric Potential", path: "/electric-potential" },
      { name: "Electric Field & Flux", path: "/electric-field-and-flux-density" },
      { name: "Field Operations", path: "/field-operations" },
    ],
  },
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
      { name: "Del Operator", path: "/del-operator" },
      { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates" },
      { name: "Spherical Coordinates", path: "/spherical-coordinates" },
    ],
  },
  // Add other topics as needed
];

const Sidebar = () => {
  const location = useLocation();

  // Find the active section (the one that contains the current route)
  const activeSection = sidebarData.find(section =>
    section.subtopics.some(sub => sub.path === location.pathname)
  );

  if (!activeSection) return null;

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 pt-16 bg-white border-r shadow-sm z-40 overflow-y-auto">
      <div className="px-4 py-6">
        {/* Topic header */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={activeSection.icon}
            alt={activeSection.topic}
            className="w-12 h-12 rounded-full bg-white"
          />
          <div>
            <h2 className="text-base font-bold text-gray-900">{activeSection.topic}</h2>
            <p className="text-xs text-gray-500">{activeSection.subtopics.length} Units</p>
          </div>
        </div>

        {/* Subtopics */}
        <ul className="space-y-1">
          {activeSection.subtopics.map((sub, index) => {
            const isActive = location.pathname === sub.path;
            return (
              <li key={sub.name}>
                <Link
                  to={sub.path}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span className="block text-xs uppercase text-gray-500">
                    Unit {index + 1}
                  </span>
                  {sub.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
