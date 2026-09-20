/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Gauss's Law
 * Run using: node backend/scripts/seedGaussLawQuiz.js
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

const gaussLawQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the integral form of Gauss’s Law in electrostatics relating total outward electric flux Ψ across a closed surface S to the total enclosed charge Q_enc?',
    options: [
      '∮_S D · dS = Q_enc',
      '∮_S D · dl = Q_enc',
      '∮_S E · dS = μ₀ Q_enc',
      '∮_S D × dS = Q_enc',
    ],
    correctAnswer: '∮_S D · dS = Q_enc',
    explanation: 'Gauss’s Law states that the net outward electric flux Ψ through any closed surface is equal to the total charge enclosed by that surface: Ψ = ∮_S D · dS = Q_enc = ∫_V ρ_v dV.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Which differential relation expresses Maxwell’s first equation (Gauss’s Law in point form) in electrostatics?',
    options: [
      '∇ · D = ρ_v',
      '∇ × D = ρ_v',
      '∇² D = 0',
      '∇ · E = 0',
    ],
    correctAnswer: '∇ · D = ρ_v',
    explanation: 'Applying the Divergence Theorem to the integral form ∮_S D · dS = ∫_V ρ_v dV yields ∫_V (∇ · D - ρ_v) dV = 0, giving the point form ∇ · D = ρ_v.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'A closed Gaussian surface encloses four point charges: q₁ = +5.0 nC, q₂ = -8.0 nC, q₃ = +12.0 nC, and q₄ = -3.0 nC. A fifth charge q₅ = +20.0 nC is located outside the surface. What is the net outward electric flux Ψ = ∮ D · dS passing through the Gaussian surface?',
    options: ['+6.0 nC', '+26.0 nC', '-6.0 nC', '0 nC'],
    correctAnswer: '+6.0 nC',
    explanation: 'By Gauss’s Law, only charges enclosed within the surface contribute to net outward flux: Q_enc = q₁ + q₂ + q₃ + q₄ = (+5.0) + (-8.0) + (+12.0) + (-3.0) = +6.0 nC. Charges outside the closed surface contribute zero net flux.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'For Gauss’s Law to be used effectively as an analytical tool to calculate D directly from ∮ D · dS = D ∮ dS = D S, which condition must the chosen Gaussian surface satisfy?',
    options: [
      'D must be everywhere normal (or tangential) to the surface with uniform magnitude over the normal parts.',
      'The Gaussian surface must be a physical conducting boundary.',
      'The total charge enclosed must always be zero.',
      'D must have non-zero curl everywhere on the surface.',
    ],
    correctAnswer: 'D must be everywhere normal (or tangential) to the surface with uniform magnitude over the normal parts.',
    explanation: 'To factor |D| out of the surface integral, D must be either strictly tangential (D · dS = 0) or strictly normal with constant magnitude over each face of the Gaussian surface.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Using a spherical Gaussian surface of radius r = 0.50 m centered on an isolated point charge Q = +4.0 nC in free space, what is the magnitude of the electric flux density D?',
    options: ['1.27 nC/m²', '5.09 nC/m²', '0.32 nC/m²', '16.00 nC/m²'],
    correctAnswer: '1.27 nC/m²',
    explanation: 'By spherical symmetry, ∮ D · dS = D(4π r²) = Q => D = Q / (4π r²) = (4.0 × 10⁻⁹ C) / (4π * 0.25 m²) = (4.0 × 10⁻⁹) / π ≈ 1.273 nC/m².',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An infinite line charge with uniform density ρ_L = +30 nC/m lies along the z-axis. A cylindrical Gaussian surface of radius ρ = 2.0 m and length L = 5.0 m is coaxial with the line. What is the electric flux density D_ρ at the cylindrical surface?',
    options: ['2.39 nC/m²', '4.77 nC/m²', '1.20 nC/m²', '7.50 nC/m²'],
    correctAnswer: '2.39 nC/m²',
    explanation: 'By cylindrical symmetry, flux passes only through the curved side: D_ρ (2π ρ L) = ρ_L L => D_ρ = ρ_L / (2π ρ) = (30 × 10⁻⁹) / (2π * 2.0) ≈ 2.387 nC/m² ≈ 2.39 nC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An infinite planar sheet at z = 0 carries a uniform surface charge density ρ_s = +40 nC/m². What is the electric field intensity E in the region z > 0? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: [
      '+2.26â_z kV/m (+2259â_z V/m)',
      '+4.52â_z kV/m',
      '+1.13â_z kV/m',
      '+9.04â_z kV/m',
    ],
    correctAnswer: '+2.26â_z kV/m (+2259â_z V/m)',
    explanation: 'Using a pillbox Gaussian surface spanning the sheet: 2 D_z A = ρ_s A => D_z = ρ_s / 2. Then E = (ρ_s / 2ε₀) â_z = (40 × 10⁻⁹ / (2 * 8.854 × 10⁻¹²)) â_z ≈ 2258.9â_z V/m ≈ 2.26â_z kV/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'If the electric flux density in a region is D = (3x²â_x + 2yâ_y + 4zâ_z) C/m², evaluate the total electric flux Ψ exiting the closed cube defined by 0 ≤ x ≤ 2, 0 ≤ y ≤ 2, 0 ≤ z ≤ 2 (in meters).',
    options: ['96 C', '48 C', '192 C', '24 C'],
    correctAnswer: '96 C',
    explanation: 'By Divergence Theorem: ∇ · D = ∂(3x²)/∂x + ∂(2y)/∂y + ∂(4z)/∂z = 6x + 2 + 4 = 6x + 6. Ψ = ∫₀² ∫₀² ∫₀² (6x + 6) dx dy dz = 4 ∫₀² (6x+6) dx = 4 [3x² + 6x]₀² = 4 [12 + 12] = 96 C.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A single point charge Q = +24 nC is placed at one vertex (corner) of a closed cubic box of side length a = 1.0 m. What is the total electric flux Ψ passing through any ONE of the three faces that do NOT meet at that vertex?',
    options: ['1.0 nC', '3.0 nC', '4.0 nC', '0.5 nC'],
    correctAnswer: '1.0 nC',
    explanation: 'By symmetry, placing 8 identical cubes around the corner vertex encloses charge Q completely, so total flux through one entire cube is Q/8 = 3.0 nC. The 3 faces meeting at that vertex experience zero flux because E lies entirely in the plane of those faces (E is tangential to the face, i.e., E ⊥ dS, so E · dS = 0). The remaining 3 opposite faces share the 3.0 nC equally: Ψ_face = (Q/8) / 3 = Q / 24 = 24 nC / 24 = 1.0 nC.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A solid dielectric sphere of radius R = 0.20 m carries a uniform volume charge density ρ_v = +50 μC/m³. What is the electric flux density D_r at an internal radial distance r = 0.12 m?',
    options: ['2.00 μC/m²', '3.33 μC/m²', '1.20 μC/m²', '5.00 μC/m²'],
    correctAnswer: '2.00 μC/m²',
    explanation: 'Inside the sphere (r < R): D_r (4π r²) = ρ_v (4/3 π r³) => D_r = (ρ_v r) / 3 = (50 × 10⁻⁶ * 0.12) / 3 = 2.00 μC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two infinite parallel planes located at x = -2 m and x = +2 m carry uniform surface charge densities ρ_s1 = +60 nC/m² and ρ_s2 = -60 nC/m², respectively. What is the electric field E in the region between the sheets (-2 < x < +2)? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: [
      '+6.78â_x kV/m (+6777â_x V/m)',
      '0 V/m',
      '+3.39â_x kV/m',
      '-6.78â_x kV/m',
    ],
    correctAnswer: '+6.78â_x kV/m (+6777â_x V/m)',
    explanation: 'Between the plates, fields from both sheets point in the +â_x direction and add constructively: E = (ρ_s / 2ε₀ + ρ_s / 2ε₀) â_x = (ρ_s / ε₀) â_x = (60 × 10⁻⁹ / 8.854 × 10⁻¹²) â_x ≈ 6.78â_x kV/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'In spherical coordinates, the electric flux density is given by D = (10 / r²) â_r C/m² for r > 0. What is the volume charge density ρ_v in this region?',
    options: ['0 C/m³', '10/r³ C/m³', '20/r³ C/m³', '-10/r² C/m³'],
    correctAnswer: '0 C/m³',
    explanation: 'ρ_v = ∇ · D = (1/r²) ∂(r² D_r)/∂r = (1/r²) ∂(r² * 10/r²)/∂r = (1/r²) ∂(10)/∂r = 0 C/m³.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A coaxial cable has an inner solid conductor of radius a = 2.0 mm carrying line charge ρ_L = +80 nC/m, and an outer cylindrical conducting shell of inner radius b = 6.0 mm carrying -ρ_L = -80 nC/m. Using Gauss’s Law, what is the electric flux density D_ρ at radial distance ρ = 4.0 mm (between the conductors)?',
    options: ['3.18 μC/m²', '6.37 μC/m²', '1.59 μC/m²', '0 μC/m²'],
    correctAnswer: '3.18 μC/m²',
    explanation: 'Enclosing a length L of the inner cylinder: D_ρ (2π ρ L) = ρ_L L => D_ρ = ρ_L / (2π ρ) = (80 × 10⁻⁹) / (2π * 0.004) = (2 × 10⁻⁵) / (2π) ≈ 3.183 μC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A solid conducting sphere of radius a = 5 cm carries charge Q₁ = +12 nC. It is surrounded by a concentric thin spherical conducting shell of radius b = 10 cm carrying charge Q₂ = -4 nC. What is the total electric flux Ψ passing through a spherical Gaussian surface of radius r = 15 cm?',
    options: ['+8.0 nC', '+12.0 nC', '+16.0 nC', '-4.0 nC'],
    correctAnswer: '+8.0 nC',
    explanation: 'Since the Gaussian surface of radius r = 15 cm encloses both the inner sphere and the outer shell, Q_enc = Q₁ + Q₂ = +12 nC + (-4 nC) = +8.0 nC. By Gauss’s Law, Ψ = Q_enc = +8.0 nC.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A sphere of radius R = 2.0 m contains volume charge density ρ_v(r) = ρ₀ (1 - r/R), where ρ₀ = 120 nC/m³. At what radial distance r_m inside the sphere does the electric field intensity E_r attain its maximum value?',
    options: [
      'r = (2/3) R ≈ 1.33 m',
      'r = (1/2) R = 1.00 m',
      'r = (3/4) R = 1.50 m',
      'r = R = 2.00 m',
    ],
    correctAnswer: 'r = (2/3) R ≈ 1.33 m',
    explanation: 'Q(r) = 4π ρ₀ ∫₀^r (r’² - r’³/R) dr’ = 4π ρ₀ [r³/3 - r⁴/(4R)]. Then D_r = Q(r) / (4π r²) = ρ₀ [r/3 - r²/(4R)]. Maximizing D_r by setting dD_r/dr = 0 => 1/3 - 2r/(4R) = 0 => r = (2/3) R = 4/3 m ≈ 1.33 m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A solid dielectric sphere of radius R has uniform volume charge density ρ_v. An off-center spherical cavity of radius a < R is hollowed out, centered at displacement vector d from the center of the sphere (|d| + a < R). Using Gauss’s Law and superposition, what is the electric field E inside the cavity?',
    options: [
      'Uniform: E = (ρ_v d) / (3ε₀), pointing in the direction of the offset vector d',
      'Zero: E = 0 everywhere inside the cavity',
      'Radial: E = (ρ_v r) / (3ε₀), pointing radially from the main sphere center',
      'Inverse square: E = (ρ_v d²) / (3ε₀ r²) â_r',
    ],
    correctAnswer: 'Uniform: E = (ρ_v d) / (3ε₀), pointing in the direction of the offset vector d',
    explanation: 'By superposition: E = E_solid - E_cavity = (ρ_v r) / (3ε₀) - (ρ_v (r - d)) / (3ε₀) = (ρ_v d) / (3ε₀), which is perfectly constant and uniform everywhere inside the cavity.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'An infinitely long cylinder of radius b = 0.50 m centered on the z-axis contains volume charge density ρ_v(ρ) = k₀ ρ² C/m³, where k₀ = 40 μC/m⁵. What is the electric flux density D_ρ at an external observation point ρ = 1.0 m?',
    options: [
      '625 nC/m² (0.625 μC/m²)',
      '1250 nC/m²',
      '312.5 nC/m²',
      '2500 nC/m²',
    ],
    correctAnswer: '625 nC/m² (0.625 μC/m²)',
    explanation: 'Enclosed charge per unit length: Q_enc / L = ∫₀^b (k₀ ρ²)(2π ρ) dρ = 2π k₀ [b⁴/4] = π(40 × 10⁻⁶)(0.5⁴) / 2 = 1.25π μC/m. For ρ = 1.0 m: D_ρ (2π ρ) = Q_enc / L => D_ρ = (1.25π × 10⁻⁶) / (2π * 1.0) = 0.625 μC/m² = 625 nC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'At the planar interface z = 0 between two dielectric media (Region 1: z > 0, ε_r1 = 2.0; Region 2: z < 0, ε_r2 = 6.0), there exists a free surface charge density ρ_s = +15.0 nC/m². If the electric field in Region 1 is E₁ = (50â_x - 100â_y + 200â_z) V/m, what is the normal component of electric flux density D_2n in Region 2 just below the boundary? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: [
      '-11.46 nC/m²',
      '+18.54 nC/m²',
      '+3.54 nC/m²',
      '-15.00 nC/m²',
    ],
    correctAnswer: '-11.46 nC/m²',
    explanation: 'By Gauss’s pillbox boundary condition: D_1n - D_2n = ρ_s => D_2n = D_1n - ρ_s. Here D_1n = ε_r1 ε₀ E_1z = 2.0 * (8.854 × 10⁻¹²) * 200 = 3.5416 nC/m². Thus D_2n = 3.5416 - 15.0 = -11.458 nC/m² ≈ -11.46 nC/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A coaxial cylinder of inner radius a = 1.0 cm carries line charge ρ_L = +62.83 nC/m (20π nC/m). The annular region 1.0 cm ≤ ρ ≤ 2.0 cm is filled with dielectric ε_r1 = 4.0, and 2.0 cm ≤ ρ ≤ 4.0 cm is filled with dielectric ε_r2 = 2.0. What is the electric field intensity E_ρ at ρ = 3.0 cm (in Layer 2)? (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: [
      '18.82 kV/m',
      '9.41 kV/m',
      '37.64 kV/m',
      '4.71 kV/m',
    ],
    correctAnswer: '18.82 kV/m',
    explanation: 'By Gauss’s Law, D_ρ = ρ_L / (2π ρ) in any concentric dielectric layer. At ρ = 0.03 m: D_ρ = (62.83 × 10⁻⁹) / (2π * 0.03) = 333.3 nC/m². In layer 2 (ε_r2 = 2.0): E_ρ = D_ρ / (ε_r2 ε₀) = (3.333 × 10⁻⁷) / (2 * 8.854 × 10⁻¹²) ≈ 18822 V/m ≈ 18.82 kV/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A hollow thick spherical shell has inner radius a = 1.0 m and outer radius b = 3.0 m. The shell carries volume charge density ρ_v(r) = (ρ₀ a²) / r² for a ≤ r ≤ b, where ρ₀ = 90 nC/m³. A point charge Q₀ = +180π nC ≈ +565.49 nC is placed at the center (r = 0). What is the electric flux density D_r at the outer surface r = b = 3.0 m?',
    options: ['25.0 nC/m²', '50.0 nC/m²', '12.5 nC/m²', '75.0 nC/m²'],
    correctAnswer: '25.0 nC/m²',
    explanation: 'Shell charge Q_shell = ∫_a^b ((ρ₀ a²) / r²) 4π r² dr = 4π ρ₀ a² (b - a) = 4π (90 × 10⁻⁹)(1.0)(2.0) = 720π nC. Total enclosed charge Q_enc = Q₀ + Q_shell = 180π + 720π = 900π nC. At r = 3.0 m: D_r = Q_enc / (4π b²) = (900π × 10⁻⁹) / (4π * 9.0) = 25.0 nC/m².',
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

    console.log('Seeding/Updating Gauss\'s Law quiz in database...');
    const result = await Quiz.findOneAndUpdate(
      { module: 'electrostatics', chapter: 'gauss-law' },
      {
        module: 'electrostatics',
        chapter: 'gauss-law',
        questions: gaussLawQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully seeded Gauss's Law quiz with ${result.questions.length} questions!`);
    
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
