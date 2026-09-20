/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Electric Field & Flux Density
 * Run using: node backend/scripts/seedElectricFluxQuiz.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'BLANK'], required: true },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  explanation: String,
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
  points: { type: Number, required: true },
  timeLimitSeconds: { type: Number, default: 120 },
  imageUrl: String,
  solutionImageUrl: String,
});

const quizSchema = new mongoose.Schema({
  module: { type: String, required: true },
  chapter: { type: String, default: '' },
  questions: [questionSchema],
});

const Quiz = mongoose.model('Quiz', quizSchema);

const electricFluxQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Point charges are placed at the corners of a square of size 4 m centered in the xy-plane. If Q = 15 μC, find the electric flux density D at (0, 0, 6).',
    options: ['–16.36î – 49.08ĵ nC/m²', '16.36î – 49.08ĵ nC/m²', '–49.08î – 16.36ĵ nC/m²', '49.08î + 16.36ĵ nC/m²'],
    correctAnswer: '–16.36î – 49.08ĵ nC/m²',
    explanation: 'Compute individual flux density contributions from each point charge at the corners to the observation point (0,0,6) using D = Q/(4π R²) a_R, and sum the vectors.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'A dielectric material has a relative permittivity εr = 3.0. If a uniform electrostatic field of magnitude E = 4.0 kV/m is applied within the medium, what is the resulting magnitude of the electric flux density D? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['106.2 nC/m²', '35.4 nC/m²', '318.7 nC/m²', '11.8 nC/m²'],
    correctAnswer: '106.2 nC/m²',
    explanation: 'Using the constitutive relation: D = εr * ε₀ * E = 3.0 * (8.854 × 10⁻¹² F/m) * (4000 V/m) = 1.0625 × 10⁻⁷ C/m² = 106.2 nC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What are the respective SI units for electric flux (Ψ) and electric flux density (D)?',
    options: ['Coulomb (C) and Coulomb per square meter (C/m²)', 'Volt (V) and Volt per meter (V/m)', 'Newton (N) and Newton per Coulomb (N/C)', 'Weber (Wb) and Tesla (T)'],
    correctAnswer: 'Coulomb (C) and Coulomb per square meter (C/m²)',
    explanation: 'Electric flux Ψ represents total lines of electric displacement (Coulombs, C). Electric flux density D is the flux per unit surface area (C/m²).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'An infinite line charge with a uniform linear charge density ρL = +50 nC/m lies along the z-axis in free space. What is the magnitude of the electric field E at a radial distance ρ = 2.0 m from the line? (k = 9 × 10⁹ N·m²/C²)',
    options: ['450 V/m', '900 V/m', '225 V/m', '1800 V/m'],
    correctAnswer: '450 V/m',
    explanation: 'E = ρL / (2πε₀ ρ) = (2 * k * ρL) / ρ = (2 * 9 × 10⁹ * 50 × 10⁻⁹) / 2.0 = 450 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'An infinite flat plane at z = 0 carries a uniform surface charge density ρs = +8.854 nC/m² in free space (ε₀ = 8.854 × 10⁻¹² F/m). What is the electric field intensity vector E at point P(2 m, -3 m, 5 m)?',
    options: ['+500â_z V/m', '-500â_z V/m', '+100â_z V/m', '+2500â_z V/m'],
    correctAnswer: '+500â_z V/m',
    explanation: 'For an infinite sheet, E = (ρs / 2ε₀) â_n. For z = 5 > 0, â_n = +â_z. E = (8.854 × 10⁻⁹) / (2 * 8.854 × 10⁻¹²) â_z = +500â_z V/m.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Three point charges are located in the z = 0 plane: a charge +Q at (–1, 0), a charge +Q at (1, 0), and a charge –2Q at (0, 1). Determine the electric flux density D at (0, 0).',
    options: ['(Q/2π)ĵ C/m²', '(Q/π)î C/m²', '(Q/π)ĵ C/m²', '(2Q/π)ĵ C/m²'],
    correctAnswer: '(Q/2π)ĵ C/m²',
    explanation: 'The fields from the two identical +Q charges at (-1,0) and (1,0) cancel along the x-axis at (0,0). The only net contribution is from -2Q at (0,1), which attracts upward along +ĵ with magnitude D = (2Q)/(4π * 1²) = Q/(2π) ĵ C/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A dielectric material has a relative permittivity εr = 5.0. If a uniform electric field of magnitude E = 10 kV/m exists inside the material, what is the magnitude of the polarization vector P? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['354.2 nC/m²', '442.7 nC/m²', '88.5 nC/m²', '177.1 nC/m²'],
    correctAnswer: '354.2 nC/m²',
    explanation: 'Electric susceptibility χe = εr - 1 = 4.0. P = χe * ε₀ * E = 4.0 * (8.854 × 10⁻¹²) * 10000 = 3.5416 × 10⁻⁷ C/m² = 354.2 nC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two infinite parallel plates carry uniform surface charge densities ρs1 = +40 nC/m² at x = -2 cm and ρs2 = -40 nC/m² at x = +2 cm in free space (ε₀ = 8.854 × 10⁻¹² F/m). What is the electric field intensity E in the region between the plates (-2 cm < x < +2 cm)?',
    options: ['+4.52â_x kV/m', '0 V/m', '-4.52â_x kV/m', '+2.26â_x kV/m'],
    correctAnswer: '+4.52â_x kV/m',
    explanation: 'Between the plates, fields from both plates add constructively: E = (ρs / ε₀) â_x = (40 × 10⁻⁹ / 8.854 × 10⁻¹²) â_x ≈ +4.52â_x kV/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two infinite line charges ρL1 = +18 nC/m along (x=0, y=0) and ρL2 = -18 nC/m along (x=4 m, y=0) run parallel to the z-axis in free space. What is the net electric field intensity E at the midpoint (2 m, 0, 0)? (k = 9 × 10⁹ N·m²/C²)',
    options: ['+324â_x V/m', '0 V/m', '+162â_x V/m', '-324â_x V/m'],
    correctAnswer: '+324â_x V/m',
    explanation: 'E1 = (2 * 9e9 * 18e-9) / 2 = 162 V/m (along +â_x). E2 = 162 V/m (along +â_x, attractive toward negative line). E_net = (162 + 162)â_x = +324â_x V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A uniform electric flux density vector D = (6â_x - 2â_y + 3â_z) μC/m² exists in free space. What is the total electric flux Ψ passing through a rectangular surface of area 4.0 m² lying in the y = 3 plane with normal vector pointing in the +â_y direction?',
    options: ['-8.0 μC', '+24.0 μC', '+12.0 μC', '+28.0 μC'],
    correctAnswer: '-8.0 μC',
    explanation: 'Ψ = ∫ D·dS = Dy * Area = (-2.0 μC/m²) * (4.0 m²) = -8.0 μC.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A circular ring of radius a lying in the xy-plane carries a uniform line charge Q. At what axial coordinate z along the axis of symmetry does the electric field intensity Ez reach its maximum magnitude?',
    options: ['z = ± a / √2 ≈ ± 0.707 a', 'z = ± a', 'z = ± a / 2', 'z = ± √2 a'],
    correctAnswer: 'z = ± a / √2 ≈ ± 0.707 a',
    explanation: 'Differentiating Ez = (Q z) / [4πε₀ (a² + z²)^(3/2)] with respect to z and equating to 0 yields (a² + z²) - 3z² = 0 => 2z² = a² => z = ± a/√2.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A spherical volume of radius R = 2.0 m centered at the origin contains a radial charge distribution ρv(r) = 5r C/m³ (where r is the radial distance in meters). What is the total electric charge Q enclosed within the sphere?',
    options: ['80π C ≈ 251.3 C', '40π C ≈ 125.7 C', '160π C ≈ 502.7 C', '20π C ≈ 62.8 C'],
    correctAnswer: '80π C ≈ 251.3 C',
    explanation: 'Q = ∫ ρv dv = 4π ∫₀² (5r) r² dr = 4π [5r⁴ / 4]₀² = 4π * (5 * 16 / 4) = 80π C ≈ 251.3 C.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An infinite line charge ρL = +8 nC/m lies along the z-axis, and a point charge Q = -16 nC is placed on the x-axis at x = 6.0 m. At what coordinate on the x-axis in the region x > 6.0 m is the net electric field intensity E = 0?',
    options: ['x = 9.0 m', 'x = 4.0 m', 'x = 12.0 m', 'x = 7.5 m'],
    correctAnswer: 'x = 9.0 m',
    explanation: 'For x > 6 m: (2k * 8) / x = (k * 16) / (x - 6)² => x = (x - 6)² => x² - 13x + 36 = 0 => (x - 9)(x - 4) = 0. For region x > 6 m, root is x = 9.0 m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A uniform line charge of length 2L = 4.0 m (extending from z = -2 m to z = +2 m) with charge density ρL = +30 nC/m lies along the z-axis in free space. What is the magnitude of the electric field Eρ at a point on the xy-plane at radial distance ρ = 1.5 m? (k = 9 × 10⁹ N·m²/C²)',
    options: ['288 V/m', '360 V/m', '144 V/m', '576 V/m'],
    correctAnswer: '288 V/m',
    explanation: 'Eρ = (2k ρL L) / (ρ √(ρ² + L²)) = (2 * 9e9 * 30e-9 * 2) / (1.5 * √(1.5² + 2²)) = 1080 / (1.5 * 2.5) = 1080 / 3.75 = 288 V/m.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Determine D at (4, 0, 3) if there is a point charge –5π mC at (4, 0, 0) and an infinite line charge 3π mC/cm along the y-axis.',
    options: ['240î + 41.1ĵ μC/m²', '–240î + 41.1ĵ μC/m²', '41.1î + 240ĵ μC/m²', '–41.1î + 240ĵ μC/m²'],
    correctAnswer: '240î + 41.1ĵ μC/m²',
    explanation: 'Compute vector flux density contribution from the point charge at (4,0,0) and the infinite line charge along the y-axis at observation point (4,0,3), and sum the vector components.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A ring placed along y² + z² = 4, x = 0 carries a uniform line charge 5 μC/m. Find the electric flux density D at P(3, 0, 0).',
    options: ['0.32î μC/m²', '0.32ĵ μC/m²', '0.32k̂ μC/m²', '0.64î μC/m²'],
    correctAnswer: '0.32î μC/m²',
    explanation: 'Using the circular ring flux formula on axis: Dx = (ρL a x) / [2 (a² + x²)^(3/2)] where radius a = 2, distance x = 3. Dx = (5e-6 * 2 * 3) / [2 * (4 + 9)^(1.5)] = 30e-6 / (2 * 46.87) ≈ 0.32î μC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A ring placed along y² + z² = 4, x = 0 carries a uniform charge 5 μC/m. If two identical point charges Q are placed at (0, –3, 0) and (0, 3, 0) in addition to the ring, find the value of Q such that D = 0 at P(3, 0, 0).',
    options: ['–51.2 mC', '–25.6 mC', '–102.4 mC', '–12.8 mC'],
    correctAnswer: '–51.2 mC',
    explanation: 'Set the axial flux density of the ring equal and opposite to the combined axial flux density from the two point charges at (0,±3,0) and solve for Q = –51.2 mC.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A circular disk of radius a = 3.0 m lying in the z = 0 plane centered at the origin carries a uniform surface charge density ρs = +53.124 nC/m². What is the electric field intensity vector E at point P(0, 0, 4.0 m) on the z-axis? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['+600â_z V/m', '+2400â_z V/m', '+1500â_z V/m', '+3000â_z V/m'],
    correctAnswer: '+600â_z V/m',
    explanation: 'Ez = (ρs / 2ε₀) [1 - z / √(a² + z²)] = [53.124e-9 / (2 * 8.854e-12)] * [1 - 4.0 / √(3² + 4²)] = 3000 * [1 - 4/5] = 3000 * 0.20 = +600â_z V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'The electric flux density in a region is given by D = (2x²y â_x + 3y²z â_y + 4xz â_z) C/m². What is the total outward electric flux Ψ passing through the closed boundary of a unit cube defined by 0 ≤ x ≤ 1, 0 ≤ y ≤ 1, 0 ≤ z ≤ 1?',
    options: ['4.5 C', '2.25 C', '9.0 C', '0 C'],
    correctAnswer: '4.5 C',
    explanation: 'Applying Divergence Theorem: Ψ = ∭ (∇·D) dV = ∭ (4xy + 6yz + 4x) dxdydz = 4(0.5)(0.5)(1) + 6(1)(0.5)(0.5) + 4(0.5)(1)(1) = 1.0 + 1.5 + 2.0 = 4.5 C.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A solid sphere of radius R = 1.0 m centered at the origin contains a volume charge density ρv(r) = ρ0 (1 - r² / R²), where ρ0 = +30 nC/m³. What is the magnitude of the electric flux density Dr at the internal radial distance r = 0.5 m?',
    options: ['4.25 nC/m²', '5.00 nC/m²', '2.50 nC/m²', '8.50 nC/m²'],
    correctAnswer: '4.25 nC/m²',
    explanation: 'Using Gauss’s law: Dr = ρ0 [r/3 - r³ / (5 R²)] = 30 * [0.5/3 - 0.125/5] = 30 * [0.16667 - 0.0250] = 30 * 0.14167 = 4.25 nC/m².',
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    const result = await Quiz.findOneAndUpdate(
      { module: 'electrostatics', chapter: 'electric-flux' },
      {
        module: 'electrostatics',
        chapter: 'electric-flux',
        questions: electricFluxQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully updated Electric Flux quiz! Total questions: ${result.questions.length}`);
    console.log(`   - Easy: ${result.questions.filter(q => q.difficulty === 'EASY').length}`);
    console.log(`   - Medium: ${result.questions.filter(q => q.difficulty === 'MEDIUM').length}`);
    console.log(`   - Hard: ${result.questions.filter(q => q.difficulty === 'HARD').length}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected cleanly');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
