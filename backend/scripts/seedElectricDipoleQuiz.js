/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Electric Dipole
 * Run using: node backend/scripts/seedElectricDipoleQuiz.js
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

const electricDipoleQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the definition and vector direction of the electric dipole moment (p) formed by two equal and opposite point charges +q and -q separated by distance d?',
    options: [
      'p = qd, pointing from the negative charge (-q) to the positive charge (+q)',
      'p = qd, pointing from the positive charge (+q) to the negative charge (-q)',
      'p = (q/d)â_r, pointing radially outward from the midpoint',
      'p = 2qd, pointing in the direction of the electric field lines',
    ],
    correctAnswer: 'p = qd, pointing from the negative charge (-q) to the positive charge (+q)',
    explanation: 'By physical and engineering convention, the electric dipole moment is defined as p = qd, with the displacement vector d directed from -q toward +q.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the standard SI unit of electric dipole moment (p)?',
    options: ['Coulomb-meter (C·m)', 'Coulomb per meter (C/m)', 'Volt-meter (V·m)', 'Newton per Coulomb (N/C)'],
    correctAnswer: 'Coulomb-meter (C·m)',
    explanation: 'Since dipole moment is charge multiplied by distance (p = q * d), its SI unit is Coulomb × meter = C·m.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'An electric dipole oriented along the z-axis is centered at the origin. What is the electrostatic potential V at any observation point on the equatorial xy-plane (z = 0, θ = 90°)?',
    options: ['V = 0 V', 'V = p / (4πε₀ r²)', 'V = 2p / (4πε₀ r²)', 'V = -p / (4πε₀ r²)'],
    correctAnswer: 'V = 0 V',
    explanation: 'V(r, θ) = (p cosθ) / (4πε₀ r²). For any point on the equatorial plane, θ = 90° => cos(90°) = 0 => V = 0 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'A pair of equal and opposite point charges +5.0 nC and -5.0 nC are separated by a small distance d = 2.0 mm. What is the magnitude of the dipole moment p?',
    options: ['1.0 × 10⁻¹¹ C·m (10 pC·m)', '2.5 × 10⁻¹² C·m', '5.0 × 10⁻⁹ C·m', '1.0 × 10⁻⁸ C·m'],
    correctAnswer: '1.0 × 10⁻¹¹ C·m (10 pC·m)',
    explanation: 'p = q * d = (5.0 × 10⁻⁹ C) * (2.0 × 10⁻³ m) = 1.0 × 10⁻¹¹ C·m = 10 pC·m.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'At a far-field distance (r ≫ d), how do the electrostatic potential V and electric field magnitude E of a point dipole scale with radial distance r?',
    options: ['V ∝ 1/r² and E ∝ 1/r³', 'V ∝ 1/r and E ∝ 1/r²', 'V ∝ 1/r³ and E ∝ 1/r⁴', 'V ∝ 1/r² and E ∝ 1/r²'],
    correctAnswer: 'V ∝ 1/r² and E ∝ 1/r³',
    explanation: 'For a point dipole: V(r) = (p cosθ) / (4πε₀ r²) ∝ 1/r², and E(r) = [p √(1 + 3cos²θ)] / (4πε₀ r³) ∝ 1/r³.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'For an electric dipole of moment p, what is the ratio of the magnitude of the electric field intensity at an axial point (E_axial at θ = 0°) to that at an equatorial point (E_eq at θ = 90°) located at the exact same radial distance r?',
    options: ['2.0 (E_axial = 2 E_eq)', '1.0 (E_axial = E_eq)', '4.0 (E_axial = 4 E_eq)', '0.5 (E_axial = 0.5 E_eq)'],
    correctAnswer: '2.0 (E_axial = 2 E_eq)',
    explanation: 'E_axial = (2p) / (4πε₀ r³), E_eq = p / (4πε₀ r³) => E_axial / E_eq = 2.0.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electric dipole of moment p = 4.0 × 10⁻¹⁰ C·m is placed in a uniform electric field E_ext = 5.0 × 10⁴ V/m at an angle of θ = 30° relative to the field lines. What is the magnitude of the torque τ exerted on the dipole?',
    options: ['10.0 μN·m (1.0 × 10⁻⁵ N·m)', '20.0 μN·m', '17.3 μN·m', '5.0 μN·m'],
    correctAnswer: '10.0 μN·m (1.0 × 10⁻⁵ N·m)',
    explanation: 'τ = |p × E| = p * E * sinθ = (4.0 × 10⁻¹⁰ C·m) * (5.0 × 10⁴ V/m) * sin(30°) = (2.0 × 10⁻⁵) * 0.5 = 1.0 × 10⁻⁵ N·m = 10.0 μN·m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electric dipole of moment p = 6.0 × 10⁻¹² C·m is oriented at an angle θ = 60° with respect to a uniform electric field E_ext = 2.0 × 10⁵ V/m. What is the electrostatic potential energy U of the dipole?',
    options: ['-0.60 μJ (-6.0 × 10⁻⁷ J)', '+0.60 μJ', '-1.04 μJ', '-1.20 μJ'],
    correctAnswer: '-0.60 μJ (-6.0 × 10⁻⁷ J)',
    explanation: 'U = -p·E = -p * E * cosθ = -(6.0 × 10⁻¹² C·m) * (2.0 × 10⁵ V/m) * cos(60°) = -(1.2 × 10⁻⁶) * 0.5 = -6.0 × 10⁻⁷ J = -0.60 μJ.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electric dipole with moment p = 2.0 × 10⁻¹⁰ C·m is initially in stable equilibrium (θ = 0°) aligned with a uniform electric field E_ext = 3.0 × 10⁴ V/m. How much external work W is required to rotate the dipole by 180° to the unstable equilibrium orientation (θ = 180°)?',
    options: ['12.0 μJ (1.2 × 10⁻⁵ J)', '6.0 μJ', '0 J', '24.0 μJ'],
    correctAnswer: '12.0 μJ (1.2 × 10⁻⁵ J)',
    explanation: 'W = U(180°) - U(0°) = [-pE cos(180°)] - [-pE cos(0°)] = (+pE) - (-pE) = 2pE = 2 * (2.0 × 10⁻¹⁰ C·m) * (3.0 × 10⁴ V/m) = 1.2 × 10⁻⁵ J = 12.0 μJ.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electric dipole of moment p = 8.0 × 10⁻¹¹ C·m â_z is centered at the origin. What is the electric potential V at an observation point P at distance r = 2.0 m and polar angle θ = 60°? (k = 9 × 10⁹ N·m²/C²)',
    options: ['90 mV (0.090 V)', '180 mV (0.180 V)', '45 mV (0.045 V)', '360 mV (0.360 V)'],
    correctAnswer: '90 mV (0.090 V)',
    explanation: 'V = (k * p * cosθ) / r² = (9 × 10⁹ * 8.0 × 10⁻¹¹ * cos(60°)) / (2.0)² = (0.72 * 0.5) / 4.0 = 0.36 / 4.0 = 0.090 V = 90 mV.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A point dipole of moment p = 10.0 nC·m â_z is located at the origin in free space (k = 9 × 10⁹ N·m²/C²). What is the magnitude of the electric field intensity E at distance r = 1.0 m and polar angle θ = 45°?',
    options: ['142.3 V/m', '90.0 V/m', '180.0 V/m', '127.3 V/m'],
    correctAnswer: '142.3 V/m',
    explanation: 'E = (k * p / r³) * √(1 + 3cos²θ) = (9 × 10⁹ * 10 × 10⁻⁹ / 1.0³) * √(1 + 3cos²(45°)) = 90 * √(1 + 1.5) = 90 * √2.5 = 90 * 1.5811 = 142.3 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'At a point (r, θ) in the field of a point dipole, if the polar coordinate angle is θ = 60°, what angle α does the total electric field vector E make with the radial unit vector â_r?',
    options: ['40.9°', '60.0°', '30.0°', '49.1°'],
    correctAnswer: '40.9°',
    explanation: 'tanα = E_θ / E_r = (sinθ) / (2cosθ) = (1/2) tanθ = (1/2) tan(60°) = √3 / 2 ≈ 0.8660 => α = tan⁻¹(0.8660) = 40.89° ≈ 40.9°.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'When an electric dipole p is placed in (i) a uniform electric field E₁ and (ii) a non-uniform electric field E₂, which statement correctly describes the net translational force F_net experienced by the dipole?',
    options: [
      'F_net = 0 in the uniform field, but F_net ≠ 0 (given by F = (p·∇)E) in the non-uniform field',
      'F_net = 0 in both uniform and non-uniform fields',
      'F_net ≠ 0 in both uniform and non-uniform fields',
      'F_net = p × E in both cases',
    ],
    correctAnswer: 'F_net = 0 in the uniform field, but F_net ≠ 0 (given by F = (p·∇)E) in the non-uniform field',
    explanation: 'In a uniform field, +q and -q experience equal and opposite forces, summing to zero. In a non-uniform field, field strengths differ at +q and -q, resulting in net force F = (p·∇)E.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electric dipole p = +p â_z is located at the origin. At an observation point along the positive x-axis (x, 0, 0), what is the direction of the resulting electric field vector E?',
    options: ['-â_z (Anti-parallel to p)', '+â_z (Parallel to p)', '+â_x (Radially outward)', '-â_y'],
    correctAnswer: '-â_z (Anti-parallel to p)',
    explanation: 'At θ = 90° (equatorial plane), E_r = 0 and E_θ â_θ = (kp / r³) â_θ. At z = 0, the unit vector â_θ points in -â_z direction, opposite to dipole moment p.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A point electric dipole with moment p = 4.0 nC·m â_z is located at the origin in free space (k = 9 × 10⁹ N·m²/C²). Using the coordinate-free formula E(r) = (1 / 4πε₀ r⁵) [3(p·r)r - r² p], what is the electric field intensity vector E at point P(3 m, 0, 4 m)?',
    options: [
      '(0.415â_x + 0.265â_z) V/m',
      '(0.265â_x + 0.415â_z) V/m',
      '(0.576â_x + 0.768â_z) V/m',
      '(0.144â_x + 0.092â_z) V/m',
    ],
    correctAnswer: '(0.415â_x + 0.265â_z) V/m',
    explanation: 'r = 3â_x + 4â_z, r = 5 m, r⁵ = 3125. p·r = 4 * 4 = 16 nC·m². 3(p·r)r = 48(3â_x + 4â_z) = 144â_x + 192â_z. r² p = 25 * 4â_z = 100â_z. E = (9 / 3125) [144â_x + 92â_z] = (0.4147â_x + 0.2650â_z) V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'An electric dipole p = 2.0 μC·m â_z is located on the z-axis in a non-uniform electric field E(z) = (50 z² + 200 z)â_z V/m. What is the net translational force F exerted on the dipole at position z = 3.0 m?',
    options: ['+1.0â_z mN (1.0 × 10⁻³â_z N)', '+2.1â_z mN', '+0.5â_z mN', '0 N'],
    correctAnswer: '+1.0â_z mN (1.0 × 10⁻³â_z N)',
    explanation: 'F = p_z (∂E_z/∂z) â_z. ∂E_z/∂z = 100z + 200 => at z=3: 100(3) + 200 = 500 V/m². F = (2.0 × 10⁻⁶ C·m) * (500) â_z = 1.0 × 10⁻³â_z N = +1.0â_z mN.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A physical dipole with moment p = 5.0 × 10⁻⁸ C·m and moment of inertia I = 2.0 × 10⁻⁶ kg·m² is suspended in a uniform electric field E_ext = 4.0 × 10⁴ V/m. When displaced by a small angle θ from its equilibrium alignment, what is its natural frequency of small-angle torsional oscillation f₀?',
    options: ['5.03 Hz (ω₀ = 31.6 rad/s)', '31.62 Hz', '2.52 Hz', '10.06 Hz'],
    correctAnswer: '5.03 Hz (ω₀ = 31.6 rad/s)',
    explanation: 'ω₀ = √(pE / I) = √((5.0 × 10⁻⁸ * 4.0 × 10⁴) / (2.0 × 10⁻⁶)) = √(2.0 × 10⁻³ / 2.0 × 10⁻⁶) = √1000 ≈ 31.62 rad/s. f₀ = ω₀ / 2π = 31.62 / 6.283 ≈ 5.03 Hz.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Two identical electric dipoles p₁ = p â_z and p₂ = p â_z (p = 1.0 × 10⁻¹⁰ C·m) are located along the z-axis separated by distance r = 0.10 m (collinear orientation). What is the electrostatic interaction potential energy U between them? (k = 9 × 10⁹ N·m²/C²)',
    options: ['-0.18 μJ (-1.8 × 10⁻⁷ J, Attractive)', '+0.18 μJ (+1.8 × 10⁻⁷ J, Repulsive)', '-0.09 μJ', '0 J'],
    correctAnswer: '-0.18 μJ (-1.8 × 10⁻⁷ J, Attractive)',
    explanation: 'E₁ at dipole 2 is (2kp / r³) â_z. U = -p₂·E₁ = -2kp² / r³ = -(2 * 9e9 * (1.0e-10)²) / (0.10)³ = -1.8 × 10⁻⁷ J = -0.18 μJ.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A linear electric quadrupole is constructed from two opposing collinear dipoles placed back-to-back at the origin (charges +q at z = +d, -2q at z = 0, and +q at z = -d). At a far distance r ≫ d, how do the electrostatic potential V and electric field E scale with radial distance r?',
    options: ['V ∝ 1/r³ and E ∝ 1/r⁴', 'V ∝ 1/r² and E ∝ 1/r³', 'V ∝ 1/r⁴ and E ∝ 1/r⁵', 'V ∝ 1/r and E ∝ 1/r²'],
    correctAnswer: 'V ∝ 1/r³ and E ∝ 1/r⁴',
    explanation: 'In multipole expansion: Monopole (V ∝ 1/r, E ∝ 1/r²), Dipole (V ∝ 1/r², E ∝ 1/r³), Quadrupole (V ∝ 1/r³, E ∝ 1/r⁴).',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'An electric dipole p = 2.0 nC·m â_z is located at position Q(0, 0, 2 m) (shifted along the z-axis). What is the electrostatic potential V at the observation point P(0, 4 m, 2 m)? (k = 9 × 10⁹ N·m²/C²)',
    options: ['0 V', '1.125 V', '2.250 V', '4.500 V'],
    correctAnswer: '0 V',
    explanation: 'Displacement vector R = r_P - r_Q = (0, 4, 2) - (0, 0, 2) = 4â_y m. p·R = (2.0â_z)·(4â_y) = 0. V = k(p·R)/R³ = 0 V (point P lies in the dipole’s equatorial bisecting plane).',
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
      { module: 'electrostatics', chapter: 'electric-dipole' },
      {
        module: 'electrostatics',
        chapter: 'electric-dipole',
        questions: electricDipoleQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully updated Electric Dipole quiz! Total questions: ${result.questions.length}`);
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
