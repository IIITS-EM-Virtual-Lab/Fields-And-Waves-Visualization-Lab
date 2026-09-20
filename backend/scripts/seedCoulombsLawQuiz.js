/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Coulomb's Law
 * Run using: node backend/scripts/seedCoulombsLawQuiz.js
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

const coulombsLawQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Point charges Q1 = 5 nC and Q2 = −2 nC are located at (2, 0, 4) and (−3, 0, 5), respectively. Calculate the electric force on a q = 1 nC charge placed at the point (1, −3, 7).',
    options: ['(-1.004i - 1.284j + 1.4k) nN', '(1.004i + 1.284j - 1.4k) nN', '(-1.284i - 1.004j + 1.4k) nN', '(1.284i + 1.004j - 1.4k) nN'],
    correctAnswer: '(-1.004i - 1.284j + 1.4k) nN',
    explanation: 'Calculate vector distances from the 1 nC charge to each source charge (5 nC and -2 nC), compute individual force vectors using Coulomb’s Law in 3D space, and add them.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'Two point charges q1 = +5 μC and q2 = +10 μC experience a repulsive force of 18.0 N in vacuum. If the setup is immersed in an insulating transformer oil with relative permittivity εr = 4.5 at the same distance, what is the new electrostatic force between them?',
    options: ['4.0 N', '81.0 N', '7.2 N', '0.25 N'],
    correctAnswer: '4.0 N',
    explanation: 'In a dielectric medium, the Coulomb force is reduced by the relative permittivity: F_medium = F_vacuum / εr = 18.0 N / 4.5 = 4.0 N.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'The electrostatic force between two stationary point charges separated by distance d is F0 = 36 mN. If the magnitude of each charge is doubled and the separation distance is tripled (3d), what is the new electrostatic force?',
    options: ['16 mN', '72 mN', '8 mN', '24 mN'],
    correctAnswer: '16 mN',
    explanation: 'From Coulomb’s Law, F ∝ (q1 * q2) / r². Scaling gives: F\' = (2 * 2 / 3²) * F0 = (4/9) * 36 mN = 16 mN.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'A positive charge Q1 = +4 nC is fixed at the origin (0, 0, 0), and a negative charge Q2 = -6 nC is located on the z-axis at (0, 0, 3 m). What is the unit vector in the direction of the force exerted on Q2 by Q1?',
    options: ['-â_z (Attractive toward origin)', '+â_z (Repulsive away from origin)', '+â_x', '-â_y'],
    correctAnswer: '-â_z (Attractive toward origin)',
    explanation: 'Opposite charges attract each other. The force acting on Q2 pulls it toward Q1 at the origin, which is in the -â_z direction.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'A neutral conducting sphere acquires a net negative electrostatic charge of Q = -3.2 μC. How many excess electrons were transferred to the sphere? (e = 1.602 × 10⁻¹⁹ C)',
    options: ['2.0 × 10¹³ electrons', '5.1 × 10¹² electrons', '2.0 × 10¹⁹ electrons', '5.0 × 10¹⁴ electrons'],
    correctAnswer: '2.0 × 10¹³ electrons',
    explanation: 'Using charge quantization: N = |Q| / e = (3.2 × 10⁻⁶ C) / (1.602 × 10⁻¹⁹ C) ≈ 2.0 × 10¹³ electrons.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Point charges Q1 = 1 mC and Q2 = −2 mC are located at (3, 2, −1) and (−1, −1, 4) respectively. Calculate the electric force on a q = 10 nC charge placed at the point (0, 3, 1).',
    options: ['(-6.512i - 3.713j + 7.509k) mN', '(6.512i + 3.713j - 7.509k) mN', '(3.713i - 6.512j + 7.509k) mN', '(-3.713i - 6.512j + 7.509k) mN'],
    correctAnswer: '(-6.512i - 3.713j + 7.509k) mN',
    explanation: 'Compute position vectors from Q1 and Q2 to the point (0,3,1), evaluate individual force vectors via Coulomb’s law, and vectorially sum them.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges q1 = 2 nC and q2 = 3 nC are placed on a flat, frictionless surface, separated by a distance of 1 cm. The 2 nC charge is supported by a wall and remains stationary. What is the instantaneous acceleration of the 3 nC charge?',
    options: ['0.5394 m/s²', '0.0032 m/s²', '0.2135 m/s²', '0.9310 m/s²'],
    correctAnswer: '0.5394 m/s²',
    explanation: 'Using F = k*q1*q2/r², F = (9e9 * 2e-9 * 3e-9) / (0.01)² = 5.4e-4 N. Given mass m = 1.0 g, a = F/m = 0.54 m/s².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges of 4 μC and -6 μC are separated by a distance of 3 meters in free space. What is the magnitude of the force between the charges?',
    options: ['24 N', '48 N', '72 N', '64 N'],
    correctAnswer: '72 N',
    explanation: 'Using Coulomb’s law: F = (k * |q1| * |q2|) / r² = (9 × 10⁹ * 4 × 10⁻⁶ * 6 × 10⁻⁶) / 3² = 72 N.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges of 2 μC and -3 μC are placed 5 cm apart. What is the magnitude of the force between them?',
    options: ['12 N', '24 N', '36 N', '60 N'],
    correctAnswer: '36 N',
    explanation: 'Using Coulomb’s law: F = (k * |q1| * |q2|) / r² = (9 × 10⁹ * 2 × 10⁻⁶ * 3 × 10⁻⁶) / (0.05)² = 36 N magnitude.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges, one with a charge of +2 μC and the other with a charge of -3 μC, are separated by a distance of 5 cm in free space. What is the magnitude of the force exerted on the positive charge due to the negative charge?',
    options: ['12 N', '12 μN', '12 mN', '12 kN'],
    correctAnswer: '12 μN',
    explanation: 'Using Coulomb’s law: F = (k * q1 * q2) / r² gives the attractive force magnitude on the positive charge.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges q1 = +4 μC and q2 = +9 μC are fixed along the x-axis at x = 0 and x = 10 cm, respectively. At what coordinate x on the line segment between them will a third charge q3 = +1 μC experience zero net electrostatic force?',
    options: ['x = 4.0 cm', 'x = 6.0 cm', 'x = 2.5 cm', 'x = 5.0 cm'],
    correctAnswer: 'x = 4.0 cm',
    explanation: 'Setting forces equal: k*q1*q3 / x² = k*q2*q3 / (10 - x)² => √4 / x = √9 / (10 - x) => 2/x = 3/(10 - x) => 20 - 2x = 3x => 5x = 20 => x = 4.0 cm.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two point charges Q1 = +2 nC and Q2 = -2 nC are fixed at (3 m, 0) and (0, 4 m) in free space. What is the magnitude of the net electrostatic force acting on a test charge q0 = +1 nC placed at the origin (0, 0)? (k = 9 × 10⁹ N·m²/C²)',
    options: ['2.30 nN', '3.12 nN', '0.88 nN', '4.50 nN'],
    correctAnswer: '2.30 nN',
    explanation: 'Fx = (9e9 * 2e-9 * 1e-9) / 3² = 2.0 nN (along -â_x). Fy = (9e9 * 2e-9 * 1e-9) / 4² = 1.125 nN (along +â_y). Net magnitude = √(2.0² + 1.125²) = 2.30 nN.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'An electron (m_e = 9.11 × 10⁻³¹ kg, e = 1.602 × 10⁻¹⁹ C) is released from rest in a uniform electrostatic field of magnitude E = 2.5 kV/m. What is the magnitude of the initial acceleration experienced by the electron?',
    options: ['4.40 × 10¹⁴ m/s²', '2.74 × 10¹¹ m/s²', '1.75 × 10¹⁵ m/s²', '3.65 × 10¹³ m/s²'],
    correctAnswer: '4.40 × 10¹⁴ m/s²',
    explanation: 'a = (e * E) / m_e = (1.602 × 10⁻¹⁹ C * 2500 V/m) / (9.11 × 10⁻³¹ kg) = 4.40 × 10¹⁴ m/s².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Two identical conducting spheres, each of mass m = 10 g (0.01 kg) carrying equal charge q, are suspended from a common point by strings of length L = 1.0 m. In equilibrium, the separation distance is x = 0.10 m. Assuming small angles (tanθ ≈ x / 2L), g = 9.8 m/s², and k = 9 × 10⁹ N·m²/C², find the charge q on each sphere.',
    options: ['73.8 nC', '14.7 nC', '125.4 nC', '36.9 nC'],
    correctAnswer: '73.8 nC',
    explanation: 'Force balance: Fe = mg * (x / 2L) = (0.01)(9.8)(0.10 / 2) = 4.9 × 10⁻³ N. Solving for q = √(Fe * x² / k) = √((4.9e-3 * 0.01) / 9e9) ≈ 73.8 nC.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Four point charges of magnitude Q = 3 pC are placed at the corners of a square of side length 1 m. The charges on the left side are positive (+Q) and the charges on the right side are negative (-Q). Find the electric field E at the center of the square (relative permittivity is 1).',
    options: ['153 V/m', '612 V/m', '76.5 V/m', '0 V/m'],
    correctAnswer: '153 V/m',
    explanation: 'Two positive and two negative charges placed symmetrically on a square generate a net electric field directed toward the negative charges. Using vector superposition E_net = 153 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Two point charges, +3 μC and -4 μC, are separated by a distance of 0.1 m in vacuum (ε₀ = 8.85 × 10⁻¹² F/m). What is the magnitude of the force between them?',
    options: ['13.52 N', '10.26 N', '12.45 N', '16.28 N'],
    correctAnswer: '13.52 N',
    explanation: 'Using Coulomb’s law: F = (1 / (4πε₀)) * (|q1| * |q2|) / r² = (9 × 10⁹) * (3 × 10⁻⁶ * 4 × 10⁻⁶) / (0.1)² = 13.52 N magnitude.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Point charges Q1 = +12 nC at (1, 0, 2) m and Q2 = -8 nC at (0, 2, 1) m are placed in free space. Determine the z-component (Fz) of the net electrostatic force exerted on a test charge q = +2 nC located at P(1, 2, 4) m.',
    options: ['+5.43 nN', '+32.75 nN', '-8.22 nN', '+11.85 nN'],
    correctAnswer: '+5.43 nN',
    explanation: 'From Q1: R1 = (0, 2, 2) m => F1z = +19.09 nN. From Q2: R2 = (1, 0, 3) m => F2z = -13.66 nN. Net Fz = 19.09 - 13.66 = +5.43 nN.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Six identical point charges, each q = +3 nC, are fixed at the vertices of a regular hexagon with side length a = 0.5 m lying in the xy-plane centered at the origin. A charge Q = -1 nC is placed on the z-axis at height z = 0.5 m. What is the magnitude of the net electrostatic force acting on charge Q? (k = 9 × 10⁹ N·m²/C²)',
    options: ['229.1 nN', '114.6 nN', '0 N', '324.0 nN'],
    correctAnswer: '229.1 nN',
    explanation: 'Distance R = √(0.5² + 0.5²) = √0.5 m. Force from 1 charge: 54 nN. Vertical component = 54 * (0.5/√0.5) = 38.184 nN. For 6 charges: F_net = 6 * 38.184 nN = 229.1 nN.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'A thin semicircular wire of radius R = 0.20 m lies in the xy-plane centered at the origin (y ≥ 0, from φ = 0 to φ = π). The wire carries a uniform positive line charge density ρL = +20 nC/m. What is the magnitude of the electrostatic force exerted on a point charge q0 = -2 nC placed at the origin (0, 0)? (k = 9 × 10⁹ N·m²/C²)',
    options: ['3.60 μN', '1.80 μN', '0 N', '7.20 μN'],
    correctAnswer: '3.60 μN',
    explanation: 'By symmetry Fx = 0. Net vertical attraction Fy = (2 * k * |q0| * ρL) / R = (2 * 9e9 * 2e-9 * 20e-9) / 0.20 = 3.60 μN.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Two protons (q = 1.602 × 10⁻¹⁹ C, m = 1.673 × 10⁻²⁷ kg) are placed in free space separated by distance r. What is the ratio of their electrostatic repulsive force to their gravitational attractive force (Fe / Fg)? (k = 9 × 10⁹ N·m²/C², G = 6.674 × 10⁻¹¹ N·m²/kg²)',
    options: ['1.24 × 10³⁶', '1.24 × 10⁴²', '2.15 × 10²⁴', '8.40 × 10¹⁵'],
    correctAnswer: '1.24 × 10³⁶',
    explanation: 'Fe / Fg = (k * q²) / (G * m²) = (9 × 10⁹ * (1.602 × 10⁻¹⁹)²) / (6.674 × 10⁻¹¹ * (1.673 × 10⁻²⁷)²) ≈ 1.24 × 10³⁶.',
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
      { module: 'electrostatics', chapter: 'coulombs-law' },
      {
        module: 'electrostatics',
        chapter: 'coulombs-law',
        questions: coulombsLawQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully updated Coulomb's Law quiz! Total questions: ${result.questions.length}`);
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
