import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';

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
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/lib/scrollToTop";
import Auth from "./pages/Auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/auth" element={<Auth />} />

          {/* Sidebar applied to all major educational routes including Home */}
          <Route element={<ContentLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vector-addition" element={<ProtectedRoute><VectorAdditionPage /></ProtectedRoute>} />
            <Route path="/scalars-and-vectors" element={<ProtectedRoute><Scalars /></ProtectedRoute>} />
            <Route path="/vector-multiplication" element={<ProtectedRoute><VectorMultiplicationPage /></ProtectedRoute>} />
            <Route path="/triple-product" element={<ProtectedRoute><TripleProductPage /></ProtectedRoute>} />

            <Route path="/vector-calculus-intro" element={<ProtectedRoute><VectorCalculusIntro /></ProtectedRoute>} />
            <Route path="/cylindrical-coordinates" element={<ProtectedRoute><CylindricalCoordinatesPage /></ProtectedRoute>} />
            <Route path="/spherical-coordinates" element={<ProtectedRoute><SphericalCoordinatesPage /></ProtectedRoute>} />
            <Route path="/del-operator" element={<ProtectedRoute><DelOperatorPage /></ProtectedRoute>} />

            <Route path="/electrostatics-intro" element={<ProtectedRoute><CoulombsLawPage /></ProtectedRoute>} />
            <Route path="/electric-dipole" element={<ProtectedRoute><ElectricDipolePage /></ProtectedRoute>} />
            <Route path="/electric-potential" element={<ProtectedRoute><ElectricPotentialPage /></ProtectedRoute>} />
            <Route path="/electric-field-and-flux-density" element={<ProtectedRoute><ElectricFluxPage /></ProtectedRoute>} />
            <Route path="/field-operations" element={<ProtectedRoute><GradientPage /></ProtectedRoute>} />
            <Route path="/gauss-law" element={<ProtectedRoute><GaussLawPage /></ProtectedRoute>} />

            <Route path="/gauss-law-contd" element={<ProtectedRoute><GaussLawContdPage /></ProtectedRoute>} />
            <Route path="/gauss-law-magnetism" element={<ProtectedRoute><GaussLawMagnestismPage /></ProtectedRoute>} />
            <Route path="/ampere-law" element={<ProtectedRoute><AmpereLawPage /></ProtectedRoute>} />
            <Route path="/faraday-law" element={<ProtectedRoute><FaradayLawPage /></ProtectedRoute>} />
            <Route path="/time-varying-potential" element={<ProtectedRoute><TimeVaryingPotential /></ProtectedRoute>} />
            <Route path="/transformer-motional-emf" element={<ProtectedRoute><EMFS /></ProtectedRoute>} />
            <Route path="/displacement-current" element={<ProtectedRoute><DisplacementCurrent /></ProtectedRoute>} />

            <Route path="/types-of-waves" element={<ProtectedRoute><TypeOfWaves /></ProtectedRoute>} />
            <Route path="/plane-wave-analysis" element={<ProtectedRoute><WaveAnalysis /></ProtectedRoute>} />
            <Route path="/wave-power-energy" element={<ProtectedRoute><PowVector /></ProtectedRoute>} />
            <Route path="/wave-reflection" element={<ProtectedRoute><WaveReflection /></ProtectedRoute>} />
          </Route>

          {/* Other pages outside sidebar */}
          <Route path="/content/:id" element={<ProtectedRoute><Content /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* ✅ No footer on login page */}
      {location.pathname !== "/auth" && <Footer />}
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
