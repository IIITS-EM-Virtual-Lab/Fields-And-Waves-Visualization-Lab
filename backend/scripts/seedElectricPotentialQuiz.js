/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Electric Potential
 * Run using: node backend/scripts/seedElectricPotentialQuiz.js
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

const electricPotentialQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the physical relationship between the electrostatic potential difference V_AB = V_B - V_A and the electric field E along a path from point A to point B?',
    options: [
      'V_AB = -∫_A^B E · dl',
      'V_AB = +∫_A^B E · dl',
      'V_AB = -∇ × E',
      'V_AB = E · (B - A)',
    ],
    correctAnswer: 'V_AB = -∫_A^B E · dl',
    explanation: 'By definition, the electric potential difference V_AB = V_B - V_A represents the external work per unit charge done against the electric field, given by V_AB = -∫_A^B E · dl.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the electrostatic potential V at distance r = 3.0 m in free space from a positive point charge Q = +6.0 nC with the reference V(∞) = 0? (k = 9 × 10⁹ N·m²/C²)',
    options: ['18.0 V', '6.0 V', '54.0 V', '2.0 V'],
    correctAnswer: '18.0 V',
    explanation: 'V = (k * Q) / r = (9 × 10⁹ N·m²/C² * 6.0 × 10⁻⁹ C) / (3.0 m) = 18.0 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Which of the following fundamental properties correctly characterizes electrostatic equipotential surfaces?',
    options: [
      'Electric field lines are everywhere perpendicular (orthogonal) to equipotential surfaces, and no work is done moving a charge along an equipotential surface.',
      'Electric field lines are always tangent to equipotential surfaces.',
      'Equipotential surfaces can intersect each other at regions of high field strength.',
      'Work done moving a charge between two points on the same equipotential surface depends on the path taken.',
    ],
    correctAnswer: 'Electric field lines are everywhere perpendicular (orthogonal) to equipotential surfaces, and no work is done moving a charge along an equipotential surface.',
    explanation: 'Since dV = -E · dl = 0 along an equipotential surface, E must be orthogonal to any displacement dl on that surface, requiring zero work (W = qΔV = 0).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'How much external work W is required to move a point charge q = -4.0 μC from a point A with potential V_A = +20 V to a point B with potential V_B = +70 V?',
    options: ['-200 μJ (-0.20 mJ)', '+200 μJ (+0.20 mJ)', '-280 μJ', '+80 μJ'],
    correctAnswer: '-200 μJ (-0.20 mJ)',
    explanation: 'W = q(V_B - V_A) = (-4.0 × 10⁻⁶ C) * (70 V - 20 V) = -200 μJ = -0.20 mJ (the field does positive work).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'If the electric potential in a Cartesian region is given by V(x, y, z) = 4x² - 3y + 5z (V), what is the vector electric field intensity E?',
    options: [
      '(-8xâ_x + 3â_y - 5â_z) V/m',
      '(8xâ_x - 3â_y + 5â_z) V/m',
      '(-8xâ_x - 3â_y - 5â_z) V/m',
      '(4xâ_x - 3â_y + 5â_z) V/m',
    ],
    correctAnswer: '(-8xâ_x + 3â_y - 5â_z) V/m',
    explanation: 'Using E = -∇V: E = -[∂(4x²)/∂x â_x + ∂(-3y)/∂y â_y + ∂(5z)/∂z â_z] = -8xâ_x + 3â_y - 5â_z V/m.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges Q₁ = +8.0 nC and Q₂ = -4.0 nC are fixed on the x-axis at x = -2.0 m and x = +4.0 m, respectively. What is the net electrostatic potential V at the origin (0, 0, 0) with V(∞) = 0? (k = 9 × 10⁹ N·m²/C²)',
    options: ['27.0 V', '45.0 V', '18.0 V', '9.0 V'],
    correctAnswer: '27.0 V',
    explanation: 'V = (k * Q₁) / r₁ + (k * Q₂) / r₂ = 9 × 10⁹ * [(8.0 × 10⁻⁹ / 2.0) + (-4.0 × 10⁻⁹ / 4.0)] = 9 * (4.0 - 1.0) = 27.0 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'In a uniform electric field E = (200â_x + 400â_y) V/m, calculate the potential difference V_AB = V_B - V_A between point A(1 m, 1 m, 0) and point B(4 m, 5 m, 0).',
    options: ['-2200 V (-2.20 kV)', '+2200 V (+2.20 kV)', '-1400 V', '-1000 V'],
    correctAnswer: '-2200 V (-2.20 kV)',
    explanation: 'For uniform E: V_AB = -E · (r_B - r_A) = -(200 * (4 - 1) + 400 * (5 - 1)) = -(600 + 1600) = -2200 V = -2.20 kV.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A uniform line charge with charge density ρ_L = 20 nC/m lies along the z-axis in free space. What is the potential difference V_AB = V_A - V_B between radial distances ρ_A = 2.0 m and ρ_B = 6.0 m? (k = 9 × 10⁹ N·m²/C²)',
    options: ['395.5 V', '180.2 V', '540.8 V', '791.0 V'],
    correctAnswer: '395.5 V',
    explanation: 'V_A - V_B = 2k ρ_L ln(ρ_B / ρ_A) = 2(9 × 10⁹)(20 × 10⁻⁹) ln(6.0 / 2.0) = 360 * ln(3) = 360 * 1.0986 = 395.5 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A thin circular ring of radius a = 4.0 m lying in the xy-plane centered at the origin carries a total uniform charge Q = +15 nC. What is the electrostatic potential V at a point P(0, 0, 3 m) on the z-axis? (k = 9 × 10⁹ N·m²/C²)',
    options: ['27.0 V', '45.0 V', '33.75 V', '18.0 V'],
    correctAnswer: '27.0 V',
    explanation: 'All charge elements of the ring are at equal distance r = √(a² + z²) = √(4² + 3²) = 5.0 m. V = (k * Q) / r = (9 × 10⁹ * 15 × 10⁻⁹) / 5.0 = 27.0 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A uniformly charged circular disk of radius a = 3.0 m in the z = 0 plane has surface charge density ρ_s = +17.708 nC/m². What is the electrostatic potential V on the z-axis at z = 4.0 m? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['1000 V (1.0 kV)', '500 V (0.5 kV)', '2000 V (2.0 kV)', '250 V'],
    correctAnswer: '1000 V (1.0 kV)',
    explanation: 'V(z) = (ρ_s / 2ε₀) [√(a² + z²) - z] = [17.708 × 10⁻⁹ / (2 * 8.854 × 10⁻¹²)] * [√(3² + 4²) - 4] = 1000 * (5.0 - 4.0) = 1000 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An isolated spherical conductor of radius R = 0.20 m holds a total charge Q = +10 nC in free space. What is the electrostatic potential at an internal point r = 0.10 m from the center? (k = 9 × 10⁹ N·m²/C²)',
    options: ['450 V', '900 V', '0 V', '225 V'],
    correctAnswer: '450 V',
    explanation: 'Inside a conducting sphere at electrostatic equilibrium, E = 0, so the entire interior is an equipotential volume at V(r) = V(R) = (k * Q) / R = (9 × 10⁹ * 10 × 10⁻⁹) / 0.20 = 450 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A proton (q = +1.602 × 10⁻¹⁹ C, m = 1.67 × 10⁻²⁷ kg) is accelerated from rest through an electrostatic potential difference of ΔV = 500 V. What is the final speed v acquired by the proton?',
    options: ['3.10 × 10⁵ m/s (310 km/s)', '1.55 × 10⁵ m/s', '9.60 × 10⁶ m/s', '4.38 × 10⁵ m/s'],
    correctAnswer: '3.10 × 10⁵ m/s (310 km/s)',
    explanation: 'v = √(2qΔV / m) = √((2 * 1.602 × 10⁻¹⁹ * 500) / (1.67 × 10⁻²⁷)) = √(1.602 × 10⁻¹⁶ / 1.67 × 10⁻²⁷) ≈ 3.10 × 10⁵ m/s = 310 km/s.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'In cylindrical coordinates, the electric potential is given by V(ρ, φ) = 50 ρ² cos(2φ) V. What is the magnitude of the electric field intensity E at the point (ρ = 2.0 m, φ = 30°)?',
    options: ['200 V/m', '100 V/m', '173.2 V/m', '400 V/m'],
    correctAnswer: '200 V/m',
    explanation: 'E_ρ = -∂V/∂ρ = -100ρ cos(2φ) = -100(2)(0.5) = -100 V/m. E_φ = -(1/ρ)∂V/∂φ = 100ρ sin(2φ) = 100(2)(√3/2) = 173.2 V/m. |E| = √((-100)² + 173.2²) = √40000 = 200 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A parallel-plate capacitor with plate area A = 0.05 m² and plate separation d = 2.0 mm is filled with a dielectric of relative permittivity ε_r = 4.0 and charged to a potential difference V₀ = 100 V. What is the total electrostatic energy W_E stored in the capacitor? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['4.43 μJ (4.427 × 10⁻⁶ J)', '8.85 μJ', '2.21 μJ', '17.71 μJ'],
    correctAnswer: '4.43 μJ (4.427 × 10⁻⁶ J)',
    explanation: 'C = (ε_r ε₀ A) / d = (4 * 8.854 × 10⁻¹² * 0.05) / 0.002 = 885.4 pF. W_E = 0.5 * C * V₀² = 0.5 * (8.854 × 10⁻¹⁰) * (100)² = 4.427 × 10⁻⁶ J = 4.43 μJ.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Three equal point charges Q = +2.0 μC are placed at the vertices of an equilateral triangle of side length s = 0.30 m in free space (k = 9 × 10⁹ N·m²/C²). What is the total electrostatic energy W_E assembled in this configuration?',
    options: ['0.360 J (360 mJ)', '0.120 J (120 mJ)', '0.720 J', '1.080 J'],
    correctAnswer: '0.360 J (360 mJ)',
    explanation: 'W_E = 3 * (k * Q² / s) = 3 * [9 × 10⁹ * (2.0 × 10⁻⁶)² / 0.30] = 3 * (0.036 / 0.30) = 0.360 J = 360 mJ.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A non-conducting solid sphere of radius R = 0.50 m carries a uniform volume charge density ρ_v = +60 nC/m³ throughout its volume. Taking the reference potential V(∞) = 0, what is the electrostatic potential V₀ at the center (r = 0) of the sphere? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['847.1 V', '564.7 V', '1129.4 V', '282.4 V'],
    correctAnswer: '847.1 V',
    explanation: 'At center r = 0: V(0) = (3/2) V(R) = (ρ_v R²) / (2ε₀) = (60 × 10⁻⁹ * 0.25) / (2 * 8.854 × 10⁻¹²) = 847.1 V (which is 1.5 times the surface potential V(R) = 564.7 V).',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Given the electrostatic potential in spherical coordinates V(r) = (V₀ / r) e^(-αr) (Yukawa / screened Coulomb potential, where V₀ and α are positive constants), what is the corresponding volume charge density ρ_v(r) in the region r > 0?',
    options: [
      '–(ε₀ α² V₀ / r) e^(-αr)',
      '+(ε₀ α² V₀ / r) e^(-αr)',
      '–(ε₀ α V₀ / r²) e^(-αr)',
      '0 C/m³',
    ],
    correctAnswer: '–(ε₀ α² V₀ / r) e^(-αr)',
    explanation: 'Using Poisson’s equation ∇²V = -ρ_v / ε₀: ∇²V = (1/r²) d/dr [r² dV/dr] = α² (V₀/r) e^(-αr) = α² V(r). Hence ρ_v = -ε₀ α² V = -(ε₀ α² V₀ / r) e^(-αr).',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A coaxial cylindrical cable consists of an inner conductor of radius a = 2.0 mm and an outer conducting sheath of radius b = 8.0 mm, separated by a dielectric of relative permittivity ε_r = 2.5. If the voltage applied between the conductors is V₀ = 500 V, what is the maximum electric field intensity E_max within the dielectric?',
    options: [
      '180.3 kV/m (1.803 × 10⁵ V/m)',
      '45.1 kV/m',
      '360.6 kV/m',
      '90.2 kV/m',
    ],
    correctAnswer: '180.3 kV/m (1.803 × 10⁵ V/m)',
    explanation: 'E(ρ) = V₀ / [ρ ln(b/a)]. The maximum field occurs at the inner conductor surface ρ = a: E_max = 500 / [0.002 * ln(4)] = 500 / 0.002773 ≈ 180.3 kV/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Two concentric spherical conducting shells have radii a = 5.0 cm and b = 15.0 cm. The space between them is filled with air (ε_r = 1.0). If the inner sphere is maintained at V = 600 V and the outer sphere is grounded (V = 0 V), what is the total electrostatic energy W_E stored in the system? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: ['1.50 μJ (1.502 × 10⁻⁶ J)', '3.00 μJ', '0.75 μJ', '6.01 μJ'],
    correctAnswer: '1.50 μJ (1.502 × 10⁻⁶ J)',
    explanation: 'C = 4πε₀ / (1/a - 1/b) = (4π * 8.854 × 10⁻¹²) / (20 - 6.667) = 1.113 × 10⁻¹⁰ / 13.333 = 8.345 pF. W_E = 0.5 * C * V² = 0.5 * (8.345 × 10⁻¹²) * (600)² = 1.502 μJ.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A grounded conducting plane occupies the z = 0 boundary. A positive point charge Q = +8.0 nC is placed at position (0, 0, d) where d = 3.0 m. Using the method of images (k = 9 × 10⁹ N·m²/C²), calculate the electrostatic potential V at the observation point P(4.0 m, 0, 3.0 m) in the upper half-space (z > 0).',
    options: ['8.02 V', '18.00 V', '9.98 V', '0 V'],
    correctAnswer: '8.02 V',
    explanation: 'By method of images, V(P) = (k * Q / r₁) - (k * Q / r₂) where r₁ = 4.0 m (distance to real charge) and r₂ = √(4² + 6²) = √52 ≈ 7.211 m (distance to image charge). V(P) = 72 * (0.25 - 0.1387) = 8.02 V.',
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    console.log('Seeding/Updating Electric Potential quiz in database...');
    const result = await Quiz.findOneAndUpdate(
      { module: 'electrostatics', chapter: 'electric-potential' },
      {
        module: 'electrostatics',
        chapter: 'electric-potential',
        questions: electricPotentialQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully seeded Electric Potential quiz with ${result.questions.length} questions!`);
    
    // Print breakdown verification
    const easyCount = result.questions.filter(q => q.difficulty === 'EASY').length;
    const medCount = result.questions.filter(q => q.difficulty === 'MEDIUM').length;
    const hardCount = result.questions.filter(q => q.difficulty === 'HARD').length;
    console.log(`   - EASY: ${easyCount}`);
    console.log(`   - MEDIUM: ${medCount}`);
    console.log(`   - HARD: ${hardCount}`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding quiz:', err);
    process.exit(1);
  }
}

seed();
