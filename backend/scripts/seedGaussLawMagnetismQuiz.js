/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Gauss's Law for Magnetism
 * Run using: node backend/scripts/seedGaussLawMagnetismQuiz.js
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

const gaussLawMagnetismQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the fundamental physical principle expressed by Gauss’s Law for Magnetism (∮_S B · dS = 0 or ∇ · B = 0)?',
    options: [
      'Magnetic monopoles (isolated magnetic charges) do not exist in nature, and magnetic field lines form continuous closed loops.',
      'Magnetic fields exert zero force on moving electric charges.',
      'The magnetic field is always conservative and irrotational (∇ × B = 0).',
      'Magnetic flux is proportional to the total electric charge enclosed.',
    ],
    correctAnswer: 'Magnetic monopoles (isolated magnetic charges) do not exist in nature, and magnetic field lines form continuous closed loops.',
    explanation: 'Gauss’s Law for Magnetism states that the net magnetic flux through any closed surface is always zero, meaning isolated magnetic poles (monopoles) do not exist and magnetic flux lines always close on themselves.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Which mathematical equation correctly represents the integral form of Gauss’s Law for Magnetism over any closed surface S?',
    options: [
      '∮_S B · dS = 0',
      '∮_S B · dl = μ₀ I_enc',
      '∮_S B · dS = μ₀ Q_m',
      '∮_S B × dS = 0',
    ],
    correctAnswer: '∮_S B · dS = 0',
    explanation: 'The total outward magnetic flux Φ = ∮_S B · dS = 0 across any closed surface S.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What are the standard SI units for magnetic flux density (B) and total magnetic flux (Φ), respectively?',
    options: [
      'Tesla (T or Wb/m²) and Weber (Wb or T·m²)',
      'Weber (Wb) and Tesla (T)',
      'Ampere per meter (A/m) and Henry (H)',
      'Coulomb (C) and Volt (V)',
    ],
    correctAnswer: 'Tesla (T or Wb/m²) and Weber (Wb or T·m²)',
    explanation: 'B is measured in Tesla (T = Wb/m² = N/(A·m)), and magnetic flux Φ = ∫ B · dS is measured in Webers (Wb = T·m² = V·s).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Because ∇ · B = 0 everywhere, the magnetic field can always be defined mathematically in terms of a magnetic vector potential A as:',
    options: [
      'B = ∇ × A',
      'B = -∇ A',
      'B = ∇ · A',
      'B = ∇² A',
    ],
    correctAnswer: 'B = ∇ × A',
    explanation: 'Since the divergence of any curl is identically zero (∇ · (∇ × A) ≡ 0), Gauss’s Law for Magnetism (∇ · B = 0) guarantees that B can always be written as the curl of a magnetic vector potential A.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'If a permanent bar magnet with North (N) and South (S) poles is cut in half along its transverse midline, what is the resulting physical state according to Gauss’s Law for Magnetism?',
    options: [
      'Two complete smaller magnets are formed, each having its own North and South pole.',
      'One piece becomes an isolated North monopole, and the other becomes an isolated South monopole.',
      'Both pieces lose their magnetization completely.',
      'The magnetic field inside both pieces collapses to zero.',
    ],
    correctAnswer: 'Two complete smaller magnets are formed, each having its own North and South pole.',
    explanation: 'Because magnetic field lines are continuous closed loops and magnetic monopoles cannot exist (∇ · B = 0), breaking a magnet creates new opposite poles at the break, producing two complete dipole magnets.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A uniform magnetic field B = (0.40â_x - 0.30â_y + 0.50â_z) T passes through a flat rectangular surface of dimensions 0.20 m × 0.30 m lying in the xy-plane (z = 0) with normal â_n = +â_z. What is the total magnetic flux Φ penetrating the surface?',
    options: ['30 mWb (0.030 Wb)', '60 mWb', '15 mWb', '42.4 mWb'],
    correctAnswer: '30 mWb (0.030 Wb)',
    explanation: 'Φ = ∫ B · dS = B_z * A = 0.50 T * (0.20 m * 0.30 m) = 0.030 Wb = 30 mWb.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Which of the following mathematical expressions represents a physically valid magnetic field B that satisfies Gauss’s Law for Magnetism (∇ · B = 0) everywhere?',
    options: [
      'B = (2x yâ_x - y²â_y + 3â_z) T',
      'B = (3xâ_x + 2yâ_y + zâ_z) T',
      'B = (x²â_x + y²â_y + z²â_z) T',
      'B = (x yâ_x + y zâ_y + x zâ_z) T',
    ],
    correctAnswer: 'B = (2x yâ_x - y²â_y + 3â_z) T',
    explanation: '∇ · B = ∂(2xy)/∂x + ∂(-y²)/∂y + ∂(3)/∂z = 2y - 2y + 0 = 0. The divergence is identically zero, satisfying Gauss’s law for magnetism.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'At the boundary between medium 1 (μ_r1 = 2.0) and medium 2 (μ_r2 = 8.0), the normal component of magnetic flux density in medium 1 is B_1n = 0.40 T. According to Gauss’s Law for Magnetism, what is the normal component B_2n in medium 2?',
    options: [
      'B_2n = 0.40 T (Normal B is strictly continuous: B_1n = B_2n)',
      'B_2n = 1.60 T',
      'B_2n = 0.10 T',
      'B_2n = 0 T',
    ],
    correctAnswer: 'B_2n = 0.40 T (Normal B is strictly continuous: B_1n = B_2n)',
    explanation: 'Applying a pillbox Gaussian surface across any interface gives ∮ B · dS = (B_1n - B_2n) ΔS = 0 => B_1n = B_2n. The normal component of B is always continuous across any interface.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A closed cubic box with side length s = 0.50 m is placed in a non-uniform magnetic field. Measurements show that the outward magnetic flux through five of its faces are +12 mWb, -8 mWb, +15 mWb, -4 mWb, and +7 mWb. What is the magnetic flux Φ₆ through the sixth face?',
    options: ['-22 mWb', '+22 mWb', '-46 mWb', '0 mWb'],
    correctAnswer: '-22 mWb',
    explanation: 'By Gauss’s Law for Magnetism, ∮_cube B · dS = ∑ Φ_i = 0 => Φ₆ = -(12 - 8 + 15 - 4 + 7) mWb = -22 mWb.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'The magnetic vector potential along the circular rim of a disk of radius R = 0.30 m is A = (5.0â_φ) Wb/m. Using Stokes’ Theorem Φ = ∮_C A · dl, what is the total magnetic flux Φ passing through the disk?',
    options: [
      '9.42 Wb (3.0π Wb)',
      '4.71 Wb (1.5π Wb)',
      '1.41 Wb',
      '18.85 Wb',
    ],
    correctAnswer: '9.42 Wb (3.0π Wb)',
    explanation: 'By Stokes’ Theorem: Φ = ∫_S B · dS = ∫_S (∇ × A) · dS = ∮_C A · dl = A_φ (2π R) = 5.0 * 2π(0.30) = 3π Wb ≈ 9.42 Wb.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An ideal long air-core solenoid with n = 1000 turns/m and cross-sectional radius r = 2.0 cm carries a steady current I = 4.0 A. What is the total magnetic flux Φ passing through its cross-sectional area? (μ₀ = 4π × 10⁻⁷ H/m)',
    options: ['6.32 μWb', '5.03 μWb', '12.63 μWb', '2.51 μWb'],
    correctAnswer: '6.32 μWb',
    explanation: 'B = μ₀ n I = (4π × 10⁻⁷)(1000)(4) = 5.027 mT. Φ = B * (π r²) = (5.027 × 10⁻³)(π * 0.02²) = 6.32 μWb.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'The magnetic field of an infinite filamentary wire along the z-axis carrying current I is B = [μ₀ I / (2π ρ)] â_φ. Verify Gauss’s Law for Magnetism by computing ∇ · B in cylindrical coordinates for ρ > 0.',
    options: [
      '∇ · B = 0, confirming B has closed circular field lines with zero divergence',
      '∇ · B = μ₀ I / (2π ρ²)',
      '∇ · B = μ₀ I / ρ',
      '∇ · B = ∞',
    ],
    correctAnswer: '∇ · B = 0, confirming B has closed circular field lines with zero divergence',
    explanation: 'In cylindrical coordinates, B_ρ = 0, B_z = 0, and B_φ does not depend on φ. Therefore, ∇ · B = (1/ρ) ∂B_φ/∂φ = 0, identically satisfying ∇ · B = 0.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A flat circular disk of radius R = 0.50 m in the z = 0 plane has uniform magnetic flux Φ_disk = 40 mWb passing through it in the +â_z direction. A hemispherical dome S_hemi of radius R is attached to the rim of the disk in the region z > 0. What is the outward magnetic flux exiting through the curved hemispherical surface S_hemi?',
    options: ['+40 mWb', '-40 mWb', '+80 mWb', '0 mWb'],
    correctAnswer: '+40 mWb',
    explanation: 'By Gauss’s Law, total flux through the closed volume formed by the disk base and hemispherical dome is 0. All flux entering through the flat base (+40 mWb) must exit through the curved dome, so Φ_hemi = +40 mWb.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'The magnetic field of a point magnetic dipole m = m â_z in spherical coordinates is B(r, θ) = [μ₀ m / (4π r³)] (2cosθ â_r + sinθ â_θ). Calculate ∇ · B for r > 0.',
    options: [
      '0 (Gauss’s Law is satisfied)',
      'μ₀ m / (4π r⁴)',
      '-μ₀ m / (2π r⁴)',
      '2 cosθ / r³',
    ],
    correctAnswer: '0 (Gauss’s Law is satisfied)',
    explanation: 'Evaluating in spherical coordinates yields (1/r²) ∂(r² B_r)/∂r + (1/(r sinθ)) ∂(sinθ B_θ)/∂θ = -2μ₀ m cosθ / (4π r⁴) + 2μ₀ m cosθ / (4π r⁴) = 0.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A toroidal core of rectangular cross-section has inner radius a = 10 cm, outer radius b = 20 cm, height h = 5 cm, and is wound with N = 500 turns carrying current I = 2.0 A in free space (μ₀ = 4π × 10⁻⁷ H/m). What is the total magnetic flux Φ passing through the rectangular cross-section?',
    options: ['6.93 μWb', '10.00 μWb', '3.47 μWb', '13.86 μWb'],
    correctAnswer: '6.93 μWb',
    explanation: 'Φ = ∫_a^b [μ₀ N I / (2π ρ)] h dρ = [μ₀ N I h / 2π] ln(b/a) = [(4π × 10⁻⁷)(500)(2)(0.05) / 2π] ln(2) = 10⁻⁵ ln(2) ≈ 6.93 μWb.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'The magnetic vector potential in a region is given in Cartesian coordinates by A = (x² y â_x - 2x z â_y + y z² â_z) Wb/m. Find the magnitude of the magnetic flux density |B| at the point P(1, 2, -1).',
    options: [
      '3.16 T (√10 T)',
      '4.24 T',
      '2.24 T (√5 T)',
      '5.00 T',
    ],
    correctAnswer: '3.16 T (√10 T)',
    explanation: 'B = ∇ × A = (z² + 2x)â_x + 0â_y + (-2z - x²)â_z. At (1, 2, -1): B = 3â_x + 1â_z T => |B| = √(3² + 1²) = √10 ≈ 3.162 T.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'In hypothetical electromagnetic theories incorporating magnetic monopoles, Gauss’s Law for Magnetism is generalized to ∮_S B · dS = q_m (where magnetic charge q_m is defined in units of magnetic flux, Webers). According to Dirac’s quantization condition (q_e q_m = n h), what is the fundamental magnetic flux quantum Φ_min = q_m passing outward through a closed surface enclosing a single elementary Dirac magnetic monopole? (h = 6.626 × 10⁻³⁴ J·s, e = 1.602 × 10⁻¹⁹ C)',
    options: [
      'Φ = h/e ≈ 4.14 × 10⁻¹⁵ Wb (Dirac flux quantum)',
      'Φ = 0 Wb',
      'Φ = h/(2e) ≈ 2.07 × 10⁻¹⁵ Wb',
      'Φ = 1.60 × 10⁻¹⁹ Wb',
    ],
    correctAnswer: 'Φ = h/e ≈ 4.14 × 10⁻¹⁵ Wb (Dirac flux quantum)',
    explanation: 'Under the standard flux-charge convention ∮_S B · dS = q_m, Dirac’s quantization condition gives q_m = h/e = (6.626 × 10⁻³⁴ J·s) / (1.602 × 10⁻¹⁹ C) ≈ 4.136 × 10⁻¹⁵ Wb.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Given the magnetic flux density B = C₀ (ρ cosφ â_ρ - 2ρ sinφ â_φ + k z â_z) in cylindrical coordinates, what value must the constant k have for this field to satisfy Gauss’s Law for Magnetism ∇ · B = 0?',
    options: ['k = 0', 'k = 1', 'k = -2', 'k = 2'],
    correctAnswer: 'k = 0',
    explanation: '∇ · B = (1/ρ) ∂(ρ² cosφ)/∂ρ + (1/ρ) ∂(-2ρ sinφ)/∂φ + ∂(kz)/∂z = 2cosφ - 2cosφ + k = k. Thus k = 0 is required for ∇ · B = 0.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'At the source-free boundary between medium 1 (μ_r1 = 1.0) and ferromagnetic medium 2 (μ_r2 = 1000.0), a magnetic field line in medium 1 makes an angle θ₁ = 30° with the normal to the interface. Using the boundary conditions B_1n = B_2n and H_1t = H_2t, what angle θ₂ does the refracted magnetic field line make with the normal in medium 2?',
    options: [
      '89.90° (Nearly tangential to the boundary)',
      '30.00°',
      '0.058°',
      '45.00°',
    ],
    correctAnswer: '89.90° (Nearly tangential to the boundary)',
    explanation: 'tanθ₂ / tanθ₁ = μ₂ / μ₁ => tanθ₂ = 1000 tan(30°) = 577.35 => θ₂ = tan⁻¹(577.35) ≈ 89.90°. In high-permeability media, magnetic flux lines bend almost completely parallel to the surface.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'If B = ∇ × A, which mathematical gauge transformation allows the vector potential A to be modified to A’ = A + ∇ψ (where ψ is any smooth scalar function) without changing the physical magnetic field B?',
    options: [
      'B’ = ∇ × (A + ∇ψ) = ∇ × A + ∇ × (∇ψ) = B + 0 = B (due to the null identity ∇ × ∇ψ ≡ 0)',
      'B’ = B + ∇ · ψ',
      'B’ = B - ∇²ψ',
      'B’ = B × ∇ψ',
    ],
    correctAnswer: 'B’ = ∇ × (A + ∇ψ) = ∇ × A + ∇ × (∇ψ) = B + 0 = B (due to the null identity ∇ × ∇ψ ≡ 0)',
    explanation: 'Because ∇ × (∇ψ) ≡ 0 for any scalar field ψ, adding ∇ψ to A leaves B = ∇ × A invariant. This is the foundation of gauge freedom (e.g., Coulomb gauge ∇ · A = 0 and Lorenz gauge).',
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

    console.log('Seeding/Updating Gauss\'s Law for Magnetism quiz in database...');
    const result = await Quiz.findOneAndUpdate(
      { module: 'maxwell-equations', chapter: 'gauss-law-magnetism' },
      {
        module: 'maxwell-equations',
        chapter: 'gauss-law-magnetism',
        questions: gaussLawMagnetismQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully seeded Gauss's Law for Magnetism quiz with ${result.questions.length} questions!`);
    
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
