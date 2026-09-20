/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Field Operations (Gradient)
 * Run using: node backend/scripts/seedGradientQuiz.js
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

const gradientQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What does the gradient of a scalar field V, denoted ∇V, physically represent at any point in space?',
    options: [
      'A vector whose magnitude is the maximum spatial rate of increase of V, pointing in the direction of that maximum increase.',
      'A scalar indicating the total flux per unit volume exiting that point.',
      'A vector pointing in the direction of zero change of V, along the equipotential surface.',
      'A vector measuring the circulation and curl of the scalar field.',
    ],
    correctAnswer: 'A vector whose magnitude is the maximum spatial rate of increase of V, pointing in the direction of that maximum increase.',
    explanation: 'By definition, ∇V is a vector field that points in the direction of the greatest spatial rate of increase of scalar field V, with magnitude equal to that maximum rate of increase.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'In electrostatics, what fundamental vector relationship connects the electric field intensity E to the electrostatic scalar potential V?',
    options: [
      'E = -∇V',
      'E = +∇V',
      'E = ∇ × (∇V)',
      'E = -∇²V',
    ],
    correctAnswer: 'E = -∇V',
    explanation: 'The electric field is the negative gradient of the potential (E = -∇V), meaning E points in the direction of steepest potential decrease and is perpendicular to equipotential surfaces.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the physical interpretation of the divergence of a vector field, ∇ · A, at a given point?',
    options: [
      'The net outward flux of A per unit volume exiting an infinitesimal volume around that point.',
      'The net line integral and circulation of A around an infinitesimal loop.',
      'The maximum directional derivative of A along the surface normal.',
      'The curl of the vector potential.',
    ],
    correctAnswer: 'The net outward flux of A per unit volume exiting an infinitesimal volume around that point.',
    explanation: '∇ · A = lim(ΔV→0) [∮ A · dS / ΔV], representing the net outward flux per unit volume (source density if positive, sink density if negative).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'What is the curl of any electrostatic field (∇ × E), and what does this imply about the electrostatic field?',
    options: [
      '∇ × E = 0, meaning the electrostatic field is conservative (irrotational) and its line integral around any closed path is zero.',
      '∇ × E = ρ_v / ε₀, meaning the field generates rotational vortex lines.',
      '∇ × E = -∂B/∂t ≠ 0 even in static conditions.',
      '∇ × E = ∇ · E.',
    ],
    correctAnswer: '∇ × E = 0, meaning the electrostatic field is conservative (irrotational) and its line integral around any closed path is zero.',
    explanation: 'In electrostatics, ∮ E · dl = 0 <=> ∇ × E = 0. This confirms the field is conservative and derivable from a scalar potential E = -∇V (since ∇ × (∇V) ≡ 0).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question: 'How is the Laplacian of a scalar field V, written as ∇²V, mathematically defined in terms of first-order vector operators?',
    options: [
      'The divergence of the gradient: ∇²V = ∇ · (∇V)',
      'The curl of the gradient: ∇²V = ∇ × (∇V)',
      'The gradient of the divergence: ∇²V = ∇ (∇ · V)',
      'The dot product of two gradients: ∇²V = (∇V) · (∇V)',
    ],
    correctAnswer: 'The divergence of the gradient: ∇²V = ∇ · (∇V)',
    explanation: 'The Laplacian of a scalar field is defined as ∇²V = ∇ · (∇V), resulting in the second-order partial derivative sum ∂²V/∂x² + ∂²V/∂y² + ∂²V/∂z² in Cartesian coordinates.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Given the electrostatic potential V(x, y, z) = 3x²y - y z² + 4z (V), find the electric field intensity vector E at the point P(2, -1, 3).',
    options: [
      '(12â_x - 3â_y - 10â_z) V/m',
      '(-12â_x + 3â_y + 10â_z) V/m',
      '(12â_x + 3â_y - 10â_z) V/m',
      '(6â_x - 3â_y + 10â_z) V/m',
    ],
    correctAnswer: '(12â_x - 3â_y - 10â_z) V/m',
    explanation: 'E = -∇V = -[(6xy)â_x + (3x² - z²)â_y + (-2yz + 4)â_z]. At (2, -1, 3): E = -[-12â_x + (12 - 9)â_y + (6 + 4)â_z] = (12â_x - 3â_y - 10â_z) V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'In cylindrical coordinates, the potential is V(ρ, φ, z) = 10 ρ sinφ - 2 z² V. What is the electric field E at the point (ρ = 4 m, φ = 30°, z = 2 m)?',
    options: [
      '(-5.00â_ρ - 8.66â_φ + 8.00â_z) V/m',
      '(5.00â_ρ + 8.66â_φ - 8.00â_z) V/m',
      '(-5.00â_ρ - 2.17â_φ + 8.00â_z) V/m',
      '(-10.00â_ρ - 8.66â_φ + 4.00â_z) V/m',
    ],
    correctAnswer: '(-5.00â_ρ - 8.66â_φ + 8.00â_z) V/m',
    explanation: 'E = -[∂V/∂ρ â_ρ + (1/ρ)∂V/∂φ â_φ + ∂V/∂z â_z] = -[10sin(30°)â_ρ + 10cos(30°)â_φ - 8â_z] = (-5â_ρ - 8.66â_φ + 8â_z) V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'For the vector flux density D = (4x y²â_x + 2x² yâ_y - 3z²â_z) C/m², calculate the divergence ∇ · D at point P(1, 2, 3).',
    options: ['0 C/m³', '18 C/m³', '-18 C/m³', '36 C/m³'],
    correctAnswer: '0 C/m³',
    explanation: '∇ · D = ∂(4xy²)/∂x + ∂(2x²y)/∂y + ∂(-3z²)/∂z = 4y² + 2x² - 6z. At (1, 2, 3): 4(4) + 2(1) - 6(3) = 16 + 2 - 18 = 0 C/m³.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A vector field in cylindrical coordinates is given by A = (ρ²â_ρ + ρ sinφ â_φ + 3z â_z). What is ∇ · A at the point (ρ = 2 m, φ = 0°, z = 5 m)?',
    options: ['10.0', '7.0', '13.0', '5.0'],
    correctAnswer: '10.0',
    explanation: '∇ · A = (1/ρ)∂(ρ³)/∂ρ + (1/ρ)∂(ρ sinφ)/∂φ + ∂(3z)/∂z = 3ρ + cosφ + 3 = 3(2) + 1 + 3 = 10.0.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Determine the curl of the vector field F = (y² z â_x + 2x y z â_y + x y² â_z).',
    options: [
      '0 (The field is irrotational / conservative)',
      '(2xyâ_x + y²â_y + 2yzâ_z)',
      '(-2xyâ_x + y²â_y)',
      '4xyz â_z',
    ],
    correctAnswer: '0 (The field is irrotational / conservative)',
    explanation: 'Evaluating the curl determinant gives all three components identically equal to zero: ∇ × F = â_x(2xy - 2xy) - â_y(y² - y²) + â_z(2yz - 2yz) = 0.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Given the potential function V(x, y, z) = 5 x³ - 3 x y² + 2 z² V, calculate the Laplacian ∇²V at the point P(2, 1, -1).',
    options: ['52 V/m²', '64 V/m²', '28 V/m²', '0 V/m²'],
    correctAnswer: '52 V/m²',
    explanation: '∇²V = ∂²V/∂x² + ∂²V/∂y² + ∂²V/∂z² = 30x - 6x + 4 = 24x + 4. At x=2: 24(2) + 4 = 52 V/m².',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'What is the unit normal vector â_n to the equipotential surface f(x, y, z) = x² + y² - z = 4 at the point P(2, 1, 1) directed toward increasing f?',
    options: [
      '(4â_x + 2â_y - â_z) / √21',
      '(2â_x + â_y - â_z) / √6',
      '(4â_x + 2â_y + â_z) / √21',
      '(â_x + â_y - â_z) / √3',
    ],
    correctAnswer: '(4â_x + 2â_y - â_z) / √21',
    explanation: 'The unit normal to any level surface f(x,y,z)=c is given by â_n = ∇f / |∇f| = (4â_x + 2â_y - â_z) / √(4² + 2² + (-1)²) = (4â_x + 2â_y - â_z) / √21.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'A vector field is defined as B(x, y, z). Under what mathematical conditions is B classified as (i) solenoidal and (ii) irrotational?',
    options: [
      '(i) Solenoidal when ∇ · B = 0; (ii) Irrotational when ∇ × B = 0',
      '(i) Solenoidal when ∇ × B = 0; (ii) Irrotational when ∇ · B = 0',
      '(i) Solenoidal when ∇² B = 0; (ii) Irrotational when ∇ · B = 0',
      '(i) Solenoidal when ∮ B · dl ≠ 0; (ii) Irrotational when ∮ B · dS = 0',
    ],
    correctAnswer: '(i) Solenoidal when ∇ · B = 0; (ii) Irrotational when ∇ × B = 0',
    explanation: 'A vector field with zero divergence (∇ · B = 0) has no point sources/sinks and is called solenoidal. A vector field with zero curl (∇ × B = 0) has no vortex circulation and is called irrotational (conservative).',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question: 'Which of the following electrostatic potential functions satisfies Laplace’s equation ∇²V = 0 in free space?',
    options: [
      'V(x, y, z) = x² - y² + 4z',
      'V(x, y, z) = x² + y² + z²',
      'V(x, y, z) = x³ - y³',
      'V(x, y, z) = x² y + z',
    ],
    correctAnswer: 'V(x, y, z) = x² - y² + 4z',
    explanation: 'For V = x² - y² + 4z: ∂²V/∂x² = 2, ∂²V/∂y² = -2, ∂²V/∂z² = 0 => ∇²V = 2 + (-2) + 0 = 0.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'In spherical coordinates, the potential of a point dipole is V(r, θ) = (p cosθ) / (4πε₀ r²). Using E = -∇V, what is the analytical expression for the electric field E(r, θ)?',
    options: [
      'E = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ)',
      'E = [p / (4πε₀ r³)] (cosθ â_r - 2sinθ â_θ)',
      'E = [p / (4πε₀ r²)] (2cosθ â_r + sinθ â_θ)',
      'E = [p / (4πε₀ r⁴)] (cosθ â_r + 2sinθ â_θ)',
    ],
    correctAnswer: 'E = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ)',
    explanation: 'Using E = -[∂V/∂r â_r + (1/r)∂V/∂θ â_θ] = -[-2p cosθ / (4πε₀ r³) â_r - p sinθ / (4πε₀ r³) â_θ] = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ).',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'For a radial field in spherical coordinates A = (k / rⁿ) â_r (r > 0, where k is a constant), for what value of the power n is the divergence ∇ · A = 0 everywhere for r > 0?',
    options: ['n = 2 (Inverse-square law)', 'n = 1', 'n = 3', 'n = 0'],
    correctAnswer: 'n = 2 (Inverse-square law)',
    explanation: '∇ · A = (1/r²) d/dr [r² · k r^(-n)] = [k(2-n)] / r^(n+1). This vanishes identically for r>0 if and only if n = 2, which is the physical reason Coulomb’s inverse-square field has zero divergence in charge-free space.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Given the vector field F = (2yâ_x + 3xâ_y) in the xy-plane, evaluate the circulation ∮_C F · dl around the perimeter of the rectangle 0 ≤ x ≤ 3, 0 ≤ y ≤ 2 in the counter-clockwise direction using Stokes’ Theorem.',
    options: ['6.0', '12.0', '0.0', '1.0'],
    correctAnswer: '6.0',
    explanation: '∇ × F = [∂(3x)/∂x - ∂(2y)/∂y] â_z = (3 - 2)â_z = 1â_z. By Stokes’ Theorem, ∮_C F · dl = ∬ (∇ × F) · dS = 1 * (Area) = 1 * (3 * 2) = 6.0.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'Which of the following statements represents the two fundamental null vector identities that hold true for any twice-differentiable scalar field V and vector field A?',
    options: [
      '∇ × (∇V) ≡ 0 (Curl of gradient is zero) and ∇ · (∇ × A) ≡ 0 (Divergence of curl is zero)',
      '∇ · (∇V) ≡ 0 and ∇ × (∇ × A) ≡ 0',
      '∇ × (∇ · A) ≡ 0 and ∇ (∇ × A) ≡ 0',
      '∇² (∇V) ≡ 0 and ∇ · (∇ · A) ≡ 0',
    ],
    correctAnswer: '∇ × (∇V) ≡ 0 (Curl of gradient is zero) and ∇ · (∇ × A) ≡ 0 (Divergence of curl is zero)',
    explanation: 'The two universal null identities in vector calculus are: (1) The curl of any gradient is identically zero (∇ × ∇V = 0), guaranteeing potential fields are conservative; (2) The divergence of any curl is identically zero (∇ · (∇ × A) = 0), guaranteeing magnetic fields B = ∇ × A have no monopoles.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'In a region of space with permittivity ε = 2ε₀, the electrostatic potential is V(x, y, z) = (40 x² y - 10 z³) V. Using Poisson’s equation ∇²V = -ρ_v / ε, find the volume charge density ρ_v at point P(1 m, 2 m, -1 m). (ε₀ = 8.854 × 10⁻¹² F/m)',
    options: [
      '-3.90 nC/m³ (-3.896 × 10⁻⁹ C/m³)',
      '+3.90 nC/m³',
      '-1.95 nC/m³',
      '-7.79 nC/m³',
    ],
    correctAnswer: '-3.90 nC/m³ (-3.896 × 10⁻⁹ C/m³)',
    explanation: '∇²V = 80y - 60z. At (1, 2, -1): ∇²V = 80(2) - 60(-1) = 220 V/m². From Poisson’s equation: ρ_v = -2ε₀ ∇²V = -2(8.854 × 10⁻¹²)(220) = -3.896 nC/m³.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question: 'In cylindrical coordinates, the potential distribution between two coaxial cylinders is V(ρ) = C₁ lnρ + C₂ where C₁ = 50 V and C₂ = 100 V. Evaluate the Laplacian ∇²V for any ρ > 0 and state what this indicates about the volume charge density ρ_v between the cylinders.',
    options: [
      '∇²V = 0, indicating a charge-free dielectric region (ρ_v = 0) satisfying Laplace’s equation',
      '∇²V = 50/ρ², indicating uniform charge distribution',
      '∇²V = -50/ρ, indicating non-zero space charge',
      '∇²V = 100 lnρ',
    ],
    correctAnswer: '∇²V = 0, indicating a charge-free dielectric region (ρ_v = 0) satisfying Laplace’s equation',
    explanation: '∇²V = (1/ρ) d/dρ [ρ d/dρ(50 lnρ + 100)] = (1/ρ) d/dρ(50) = 0. This confirms the inter-conductor dielectric space contains no net free volume charge (ρ_v = 0).',
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

    console.log('Seeding/Updating Field Operations (gradient) quiz in database...');
    const result = await Quiz.findOneAndUpdate(
      { module: 'electrostatics', chapter: 'gradient' },
      {
        module: 'electrostatics',
        chapter: 'gradient',
        questions: gradientQuestions,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Successfully seeded Field Operations quiz with ${result.questions.length} questions!`);
    
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
