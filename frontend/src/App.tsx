import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import Content from "@/pages/Content";
import Scalars from "./pages/vector-algebra/scalars";
import VectorAdditionPage from "./pages/vector-algebra/addition";
import VectorMultiplicationPage from "./pages/vector-algebra/multiplication";
import TripleProductPage from "./pages/vector-algebra/triple-product";
import VectorCalculusIntro from "./pages/vector-calculus/vector-calculus-intro";
import CylindricalCoordinatesPage from "./pages/vector-calculus/cylindrical-coordinates";
import SphericalCoordinatesPage from "./pages/vector-calculus/spherical-coordinates";
import DelOperatorPage from "./pages/vector-calculus/del-operator";
import CartesianCylindricalSphericalPage from "./pages/vector-calculus/cartesian-cylindrical-spherical";
import CoulombsLawPage from "./pages/electrostatics/coulombs-law";
import ElectricFluxPage from "./pages/electrostatics/electric-flux";
import GradientPage from "./pages/electrostatics/gradient";
import ElectricPotentialPage from "./pages/electrostatics/electric-potential";
import GaussLawPage from "./pages/electrostatics/gauss-law";
import ElectricDipolePage from "./pages/electrostatics/electric-dipole";
import GaussLawContdPage from "./pages/maxwell-equations/gauss-law-contd";
import AmpereLawPage from "./pages/maxwell-equations/amperes-law";
import FaradayLawPage from "./pages/maxwell-equations/faradays-law";
import TimeVaryingPotential from "./pages/maxwell-equations/time-varying-potential";
import EMFS from "./pages/maxwell-equations/emfs";
import DisplacementCurrent from "./pages/maxwell-equations/displacement-current";
import GaussLawMagnestismPage from "./pages/maxwell-equations/gauss-law-magnetism";
import TypeOfWaves from "./pages/wave-propagation/waves_in_general";
import WaveAnalysis from './pages/wave-propagation/wave_analysis';
import PowVector from './pages/wave-propagation/pow_vector';
import WaveReflection from './pages/wave-propagation/wave_reflection';

import ContentLayout from "@/pages/ContentLayout";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/lib/scrollToTop";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ProfilePage from "./pages/ProfilePage";
import ChapterQuiz from './pages/ChapterQuiz';
import UserDashboard from "./pages/UserDashboard";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/quiz/:moduleName/:chapterName" element={<ChapterQuiz />} />
          
          <Route element={<ContentLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/vector-addition" element={<VectorAdditionPage />} />
            <Route path="/scalars-and-vectors" element={<Scalars />} />
            <Route path="/vector-multiplication" element={<VectorMultiplicationPage />} />
            <Route path="/triple-product" element={<TripleProductPage />} />

            <Route path="/vector-calculus-intro" element={<VectorCalculusIntro />} />
            <Route path="/cylindrical-coordinates" element={<CylindricalCoordinatesPage />} />
            <Route path="/spherical-coordinates" element={<SphericalCoordinatesPage />} />
            <Route path="/del-operator" element={<DelOperatorPage />} />
            <Route path="/cartesian-cylindrical-spherical" element={<CartesianCylindricalSphericalPage />} />

            <Route path="/electrostatics-intro" element={<CoulombsLawPage />} />
            <Route path="/electric-dipole" element={<ElectricDipolePage />} />
            <Route path="/electric-potential" element={<ElectricPotentialPage />} />
            <Route path="/electric-field-and-flux-density" element={<ElectricFluxPage />} />
            <Route path="/field-operations" element={<GradientPage />} />
            <Route path="/gauss-law" element={<GaussLawPage />} />

            <Route path="/gauss-law-contd" element={<GaussLawContdPage />} />
            <Route path="/gauss-law-magnetism" element={<GaussLawMagnestismPage />} />
            <Route path="/ampere-law" element={<AmpereLawPage />} />
            <Route path="/faraday-law" element={<FaradayLawPage />} />
            <Route path="/time-varying-potential" element={<TimeVaryingPotential />} />
            <Route path="/transformer-motional-emf" element={<EMFS />} />
            <Route path="/displacement-current" element={<DisplacementCurrent />} />

            <Route path="/types-of-waves" element={<TypeOfWaves />} />
            <Route path="/plane-wave-analysis" element={<WaveAnalysis />} />
            <Route path="/wave-power-energy" element={<PowVector />} />
            <Route path="/wave-reflection" element={<WaveReflection />} />
          </Route>

          <Route path="/content/:id" element={<Content />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quizzes/module/:moduleName/common" element={<ChapterQuiz />} />
          <Route path="/userdashboard" element={<UserDashboard />} />

        </Routes>
      </div>

      {/* {location.pathname !== "/auth" && <Footer />} */}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
