import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import Home from "@/pages/Home";
import Content from "@/pages/Content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentLayout from "@/pages/ContentLayout";
import Scalars from "./pages/vector-algebra/scalars";
import VectorAdditionPage from "./pages/vector-algebra/addition";
import VectorMultiplicationPage from "./pages/vector-algebra/multiplication";
import ScrollToTop from "./lib/scrollToTop";
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
import About from "./pages/About";
import GaussLawMagnestismPage from "./pages/maxwell-equations/gauss-law-magnetism";
import TypeOfWaves from "./pages/wave-propagation/waves_in_general";
import WaveAnalysis from './pages/wave-propagation/wave_analysis';
import PowVector from './pages/wave-propagation/pow_vector';
import WaveReflection from './pages/wave-propagation/wave_reflection';
import TimeVaryingPotential from './pages/maxwell-equations/time-varying-potential';
import EMFS from "./pages/maxwell-equations/emfs"; 
import DisplacementCurrent from "./pages/maxwell-equations/displacement-current";
import Auth from "./pages/Auth";

// Protected Route component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/content/" element={
          <ProtectedRoute>
            <ContentLayout />
          </ProtectedRoute>
        }>
          <Route path=":id/" element={<Content />} />
        </Route>
        <Route path="/contributors" element={<Scalars />} />
        <Route path="/scalars-and-vectors" element={
          <ProtectedRoute>
            <Scalars />
          </ProtectedRoute>
        } />
        <Route path="/vector-addition" element={
          <ProtectedRoute>
            <VectorAdditionPage />
          </ProtectedRoute>
        } />
        <Route path="/vector-multiplication" element={
          <ProtectedRoute>
            <VectorMultiplicationPage />
          </ProtectedRoute>
        } />
        <Route path="/triple-product" element={
          <ProtectedRoute>
            <TripleProductPage />
          </ProtectedRoute>
        } />
        <Route path="/vector-calculus-intro" element={
          <ProtectedRoute>
            <VectorCalculusIntro />
          </ProtectedRoute>
        } />
        <Route path="/cylindrical-coordinates" element={
          <ProtectedRoute>
            <CylindricalCoordinatesPage />
          </ProtectedRoute>
        } />
        <Route path="/spherical-coordinates" element={
          <ProtectedRoute>
            <SphericalCoordinatesPage />
          </ProtectedRoute>
        } />
        <Route path="/del-operator" element={
          <ProtectedRoute>
            <DelOperatorPage />
          </ProtectedRoute>
        } />
        <Route path="/electrostatics-intro" element={
          <ProtectedRoute>
            <CoulombsLawPage />
          </ProtectedRoute>
        } />
        <Route path="/electric-field-and-flux-density" element={
          <ProtectedRoute>
            <ElectricFluxPage />
          </ProtectedRoute>
        } />
        <Route path="/field-operations" element={
          <ProtectedRoute>
            <GradientPage />
          </ProtectedRoute>
        } />
        <Route path="/electric-potential" element={
          <ProtectedRoute>
            <ElectricPotentialPage />
          </ProtectedRoute>
        } />
        <Route path="/gauss-law" element={
          <ProtectedRoute>
            <GaussLawPage />
          </ProtectedRoute>
        } />
        <Route path="/gauss-law-contd" element={
          <ProtectedRoute>
            <GaussLawContdPage />
          </ProtectedRoute>
        } />
        <Route path="/electric-dipole" element={
          <ProtectedRoute>
            <ElectricDipolePage />
          </ProtectedRoute>
        } />
        <Route path="/ampere-law" element={
          <ProtectedRoute>
            <AmpereLawPage />
          </ProtectedRoute>
        } />
        <Route path="/faraday-law" element={
          <ProtectedRoute>
            <FaradayLawPage />
          </ProtectedRoute>
        } />
        <Route path="/time-varying-potential" element={
          <ProtectedRoute>
            <TimeVaryingPotential />
          </ProtectedRoute>
        } />
        <Route path="/transformer-motional-emf" element={
          <ProtectedRoute>
            <EMFS />
          </ProtectedRoute>
        } />
        <Route path="/gauss-law-magnetism" element={
          <ProtectedRoute>
            <GaussLawMagnestismPage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/types-of-waves" element={
          <ProtectedRoute>
            <TypeOfWaves />
          </ProtectedRoute>
        } />
        <Route path="/plane-wave-analysis" element={
          <ProtectedRoute>
            <WaveAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/wave-power-energy" element={
          <ProtectedRoute>
            <PowVector />
          </ProtectedRoute>
        } />
        <Route path="/wave-reflection" element={
          <ProtectedRoute>
            <WaveReflection />
          </ProtectedRoute>
        } />
        <Route path="/displacement-current" element={
          <ProtectedRoute>
            <DisplacementCurrent />
          </ProtectedRoute>
        } />
      </Routes>
      {location.pathname !== "/scalars-and-vectors" && location.pathname !== "/auth" && <Footer />}
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