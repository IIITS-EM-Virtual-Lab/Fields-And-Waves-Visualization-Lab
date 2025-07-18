// src/pages/ModulePage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice"; // make sure path is correct

const modules: Record<string, { name: string; path: string; topics: string[] }[]> = {
 "vector-algebra": [
    { name: "Scalars", path: "/scalars-and-vectors", topics: ["Definition", "Examples"] },
    { name: "Addition", path: "/vector-addition", topics: ["Vector Sum", "Graphical Representation"] },
    { name: "Multiplication", path: "/vector-multiplication", topics: ["Dot Product", "Cross Product"] },
    { name: "Triple Product", path: "/triple-product", topics: ["Scalar Triple", "Vector Triple"] },
  ],
  "vector-calculus": [
    { name: "Cylindrical Coordinates", path: "/cylindrical-coordinates", topics: ["ρ, φ, z system"] },
    { name: "Spherical Coordinates", path: "/spherical-coordinates", topics: ["r, θ, φ system"] },
    { name: "Cartesian, Cylindrical and Spherical", path: "/cartesian-cylindrical-spherical", topics: ["Coordinate Comparison"] },
    { name: "Intro", path: "/vector-calculus-intro", topics: ["Gradient", "Divergence", "Curl"] },
    { name: "Del Operator", path: "/del-operator", topics: ["∇ symbol usage"] },
  ],
  "electrostatics": [
    { name: "Intro", path: "/electrostatics-intro", topics: ["Charge Basics"] },
    { name: "Electric Field & Flux", path: "/electric-field-and-flux-density", topics: ["Gauss Law Idea"] },
    // { name: "Field Operations", path: "/field-operations", topics: ["Gradient, Divergence"] },
    { name: "Electric Potential", path: "/electric-potential", topics: ["Potential Energy"] },
    // { name: "Gauss Law", path: "/gauss-law", topics: ["Integral & Differential Forms"] },
    { name: "Electric Dipole", path: "/electric-dipole", topics: ["Dipole Moment"] },
  ],
  "maxwell-equations": [
    { name: "Gauss Law", path: "/gauss-law-contd", topics: ["Field Intuition"] },
    { name: "Gauss Law Magnetism", path: "/gauss-law-magnetism", topics: ["No Magnetic Monopoles"] },
    { name: "Faraday Law", path: "/faraday-law", topics: ["Induced EMF"] },
    { name: "Ampere Law", path: "/ampere-law", topics: ["Current & Fields"] },
    { name: "Displacement Current", path: "/displacement-current", topics: ["Ampere-Maxwell Law"] },
    { name: "Time Varying Potential", path: "/time-varying-potential", topics: ["Time-Dependent Fields"] },
    { name: "EMF", path: "/transformer-motional-emf", topics: ["Motional EMF"] },
  ], 
};

const moduleIcons: Record<string, string> = {
  "vector-algebra": "/assets/vector-algebra.png",
  "vector-calculus": "/assets/vector-calculus.png",
  "electrostatics": "/assets/vector-calculus.png",
  "maxwell-equations": "/assets/maxwell.png",
};

const ModulePage = () => {
  const { moduleSlug } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const moduleKey = moduleSlug || "";
  const chapterList = modules[moduleKey];

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="flex items-center cursor-pointer mb-6" onClick={() => navigate("/")}>
        <img src="/homeicon.png" alt="Home" className="h-6 w-6 mr-2 -ml-1" />
      </div>

      <h1 className="text-4xl text-[#212121] font-bold font-sans mb-2 capitalize -ml-0.5">{moduleSlug?.replace(/-/g, " ")}</h1>
      <p className="mb-6 text-gray-600">15 possible quiz points</p>

      <div className="space-y-6">
        {chapterList?.map((chapter, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <img src={moduleIcons[moduleKey]} alt={moduleKey} className="w-6 h-6 rounded-full" />
                </div>
                <div>
                  <h2
                    className="text-l font-semibold text-gray-700 cursor-pointer hover:underline"
                    onClick={() => navigate(chapter.path)}
                  >
                    Unit {index + 1}: {chapter.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">Unit mastery: 0%</span>
                <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">i</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div>
              {chapter.topics.map((topic, i) => (
                <div
                  key={i}
                  className="py-1 text-sm text-gray-700 cursor-pointer hover:underline"
                  onClick={() => navigate(chapter.path)}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Course Challenge Block */}
        {["vector-calculus", "maxwell-equations"].includes(moduleKey) && (
          <div className="mt-6 flex items-center justify-between border border-gray-300 rounded-md p-6 bg-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Course challenge</h2>
              <p className="text-gray-700 text-sm">Test your knowledge of the skills in this course.</p>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(`/quizzes/module/${moduleKey}/common`)}
                  className="mt-3 inline-block bg-white text-blue-500 border border-gray-500 text-sm font-bold px-4 py-2 rounded transition"
                >
                  Start Course challenge
                </button>
              ) : (
                <p className="mt-3 text-[#a00032] text-sm">
                  Login to unlock this challenge
                </p>
              )}
            </div>
            <img src="https://thumbs.dreamstime.com/b/open-agenda-pen-check-mark-icon-illustration-flat-vector-checklist-pages-yellow-pencil-emphasizing-planning-389227164.jpg" alt="Challenge" className="h-24 w-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulePage;
