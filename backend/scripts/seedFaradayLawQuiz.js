/**
 * Seed Script: Updates or inserts the complete 20 questions bank for Faraday's Law
 * Run using: node backend/scripts/seedFaradayLawQuiz.js
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

const faradayLawQuestions = [
  // ── EASY (5 questions) ──
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question:
      'What is the mathematical statement of Faraday’s Law of Induction relating induced electromotive force (EMF, E) to the time rate of change of magnetic flux Φ through an N-turn coil?',
    options: [
      'E = -N (dΦ/dt)',
      'E = +N (dΦ/dt)',
      'E = -N ∫ Φ dt',
      'E = -(1/N) (dΦ/dt)',
    ],
    correctAnswer: 'E = -N (dΦ/dt)',
    explanation:
      'Faraday’s Law states that the magnitude of induced EMF is proportional to the time rate of change of magnetic flux linkage, with the negative sign (Lenz’s Law) indicating that the induced EMF opposes the flux change: E = -N(dΦ/dt).',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question:
      'Which differential equation represents Faraday’s Law in point/differential form (Maxwell’s 2nd equation for time-varying electromagnetic fields)?',
    options: [
      '∇ × E = -∂B/∂t',
      '∇ × E = 0',
      '∇ · E = -∂B/∂t',
      '∇ × H = -∂D/∂t',
    ],
    correctAnswer: '∇ × E = -∂B/∂t',
    explanation:
      'Applying Stokes’ Theorem to ∮_C E · dl = -∫_S (∂B/∂t) · dS yields ∇ × E = -∂B/∂t.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question:
      'What is the physical principle underlying the negative sign in Faraday’s Law (E = -dΦ/dt), known as Lenz’s Law?',
    options: [
      'Conservation of Energy: The induced current produces a magnetic field that opposes the change in magnetic flux that created it.',
      'Conservation of Electric Charge: Charge cannot be created or destroyed.',
      'Newton’s Third Law: The magnetic force is equal and opposite to the electric force.',
      'Ohm’s Law: Resistance is always negative during induction.',
    ],
    correctAnswer:
      'Conservation of Energy: The induced current produces a magnetic field that opposes the change in magnetic flux that created it.',
    explanation:
      'Lenz’s Law guarantees conservation of energy. If the induced field aided the flux change, an infinite runaway current would be generated without external work.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question:
      'A flat coil of N = 200 turns encloses an area A = 0.05 m². A perpendicular magnetic field through the coil increases uniformly from B₁ = 0.20 T to B₂ = 0.80 T in Δt = 0.30 s. What is the magnitude of the induced EMF |E|?',
    options: ['20.0 V', '10.0 V', '40.0 V', '6.0 V'],
    correctAnswer: '20.0 V',
    explanation:
      '|E| = N (ΔΦ/Δt) = 200 * [(0.80 - 0.20) * 0.05 / 0.30] = 200 * (0.030 / 0.30) = 20.0 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    timeLimitSeconds: 120,
    question:
      'In electromagnetics, what is the key physical difference between Transformer EMF and Motional EMF?',
    options: [
      'Transformer EMF arises from a time-varying magnetic field in a stationary circuit, while Motional EMF arises from physical motion of a conductor across a magnetic field.',
      'Transformer EMF only occurs in DC circuits, while Motional EMF only occurs in AC circuits.',
      'Transformer EMF requires magnetic monopoles, while Motional EMF requires superconductors.',
      'Transformer EMF produces electric current, while Motional EMF does not.',
    ],
    correctAnswer:
      'Transformer EMF arises from a time-varying magnetic field in a stationary circuit, while Motional EMF arises from physical motion of a conductor across a magnetic field.',
    explanation:
      'Total EMF E = E_transformer + E_motional = -∫_S (∂B/∂t) · dS + ∮_C (v × B) · dl.',
  },

  // ── MEDIUM (9 questions) ──
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'A conducting rod of length L = 0.40 m slides with constant velocity v = 15.0 m/s along frictionless parallel rails in a uniform magnetic field B = 0.50 T directed perpendicular into the rail plane. If the rails are connected through a resistor R = 3.0 Ω, what is the induced current I_ind flowing through the resistor?',
    options: ['1.00 A', '2.00 A', '0.50 A', '3.00 A'],
    correctAnswer: '1.00 A',
    explanation:
      'E_m = B L v = 0.50 * 0.40 * 15.0 = 3.0 V. I_ind = E_m / R = 3.0 V / 3.0 Ω = 1.00 A.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'A rectangular armature coil with N = 150 turns and dimensions 0.10 m × 0.20 m (A = 0.020 m²) rotates at ω = 120π rad/s (f = 60 Hz) in a uniform magnetic field B = 0.80 T. What is the peak (maximum) induced voltage E_max generated by the coil?',
    options: ['904.8 V (288π V)', '452.4 V', '1809.6 V', '60.0 V'],
    correctAnswer: '904.8 V (288π V)',
    explanation:
      'E_max = N B A ω = 150 * 0.80 * 0.020 * 120π = 288π V ≈ 904.8 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'A metal rod of length L = 0.50 m pivots about one fixed end in the xy-plane and rotates with constant angular speed ω = 40.0 rad/s in a uniform perpendicular magnetic field B = 0.60â_z T. What is the potential difference (induced EMF E) established between the two ends of the rod?',
    options: ['3.00 V', '6.00 V', '1.50 V', '12.00 V'],
    correctAnswer: '3.00 V',
    explanation:
      'E = ∫₀^L (ω r B) dr = (1/2) B ω L² = (1/2)(0.60 T)(40.0 rad/s)(0.50 m)² = 3.00 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'A cylindrical region of radius R = 0.10 m centered on the z-axis contains a uniform time-varying magnetic field B(t) = (50 t²)â_z T. Using the integral form of Faraday’s Law, what is the magnitude of the induced circular electric field E_φ at an internal radial distance r = 0.06 m at time t = 2.0 s?',
    options: ['6.00 V/m', '12.00 V/m', '3.00 V/m', '60.00 V/m'],
    correctAnswer: '6.00 V/m',
    explanation:
      'Inside the cylinder (r < R): E_φ (2π r) = π r² (dB/dt) => E_φ = (r/2)(100 t). At r = 0.06 m and t = 2.0 s: E_φ = (0.06 / 2) * 200 = 6.00 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'For the same cylindrical region of radius R = 0.10 m with B(t) = (50 t²)â_z T, what is the magnitude of the induced electric field E_φ at an EXTERNAL radial distance r = 0.20 m at time t = 2.0 s?',
    options: ['5.00 V/m', '10.00 V/m', '2.50 V/m', '20.00 V/m'],
    correctAnswer: '5.00 V/m',
    explanation:
      'Outside the magnetic cylinder (r > R): E_φ = (R² / 2r)(dB/dt) = [0.010 / (2 * 0.20)] * 200 = 5.00 V/m.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'A square loop of side length a = 0.50 m lies in the xy-plane (0 ≤ x ≤ 0.5, 0 ≤ y ≤ 0.5). The magnetic field in the region is B(x, t) = (4.0 x cos(100 t))â_z T. What is the induced EMF E(t) in the loop?',
    options: [
      '+25.0 sin(100t) V',
      '-25.0 sin(100t) V',
      '+50.0 cos(100t) V',
      '+12.5 sin(100t) V',
    ],
    correctAnswer: '+25.0 sin(100t) V',
    explanation:
      'Φ(t) = ∫₀^0.5 4x cos(100t)(0.5) dx = 2cos(100t) [x²/2]₀^0.5 = 0.25 cos(100t) Wb. E = -dΦ/dt = -0.25(-100 sin(100t)) = +25.0 sin(100t) V.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'In a motional EMF setup, a conducting rod of length L = 0.50 m and resistance R = 2.0 Ω is pulled at constant speed v = 8.0 m/s along frictionless zero-resistance rails across a uniform field B = 0.75 T. What mechanical external power P_mech must be supplied to maintain this constant speed?',
    options: ['4.50 W', '9.00 W', '2.25 W', '18.00 W'],
    correctAnswer: '4.50 W',
    explanation:
      'E = BLv = 0.75 * 0.50 * 8.0 = 3.0 V. Electrical dissipation P = E² / R = 3.0² / 2.0 = 4.50 W. By conservation of energy, P_mech = F_ext v = 4.50 W.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'In a region where a time-varying magnetic field ∂B/∂t ≠ 0 is present, why does the line integral of the electric field between two points A and B depend on the path chosen?',
    options: [
      'Because ∇ × E = -∂B/∂t ≠ 0, the induced electric field is non-conservative, so ∮ E · dl ≠ 0 and path integrals are path-dependent.',
      'Because Ohm’s law fails in the presence of magnetic fields.',
      'Because dielectric polarization creates surface charges.',
      'Because the speed of light is finite.',
    ],
    correctAnswer:
      'Because ∇ × E = -∂B/∂t ≠ 0, the induced electric field is non-conservative, so ∮ E · dl ≠ 0 and path integrals are path-dependent.',
    explanation:
      'A scalar potential V uniquely defining voltage only exists when ∇ × E = 0. When ∂B/∂t ≠ 0, ∇ × E ≠ 0, making E non-conservative and path-dependent.',
  },
  {
    type: 'MCQ',
    difficulty: 'MEDIUM',
    points: 2,
    timeLimitSeconds: 120,
    question:
      'Two coupled coils have mutual inductance M = 25 mH. If the current in Coil 1 changes according to i₁(t) = 4.0 sin(200π t) A, what is the peak induced voltage E_2,max across Coil 2?',
    options: ['62.8 V (20π V)', '31.4 V (10π V)', '125.7 V', '5.0 V'],
    correctAnswer: '62.8 V (20π V)',
    explanation:
      'E_2,max = M ω I₀ = 0.025 * (200π) * 4.0 = 20π V ≈ 62.83 V.',
  },

  // ── HARD (6 questions) ──
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'A square loop of wire of side length L = 0.20 m in the xy-plane is moving in the +â_x direction with velocity v = 10.0 m/s in a time-varying, spatially non-uniform magnetic field B(x, t) = (30 x t)â_z T. At t = 2.0 s, when the loop spans 0.40 ≤ x ≤ 0.60 m, what is the total induced EMF E_total in the loop?',
    options: ['-24.60 V', '-24.00 V', '-0.60 V', '+23.40 V'],
    correctAnswer: '-24.60 V',
    explanation:
      'E_trans = -∫ (∂B/∂t) dS = -30(0.20)[(0.36 - 0.16)/2] = -0.60 V. E_mot = v L [B(x₁) - B(x₂)] = 10(0.20)[30(0.4)(2) - 30(0.6)(2)] = -24.00 V. Total E = -0.60 - 24.00 = -24.60 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'A flexible circular conducting loop in the xy-plane is placed in a static, non-uniform perpendicular magnetic field B(ρ) = [B₀ / (1 + (ρ/R)²)] â_z (B₀ = 2.0 T, R = 0.50 m). If the loop radius expands at constant speed u_ρ = dρ/dt = 4.0 m/s, what is the instantaneous induced EMF |E| when the radius reaches ρ = 0.50 m = R?',
    options: [
      '12.57 V (4.0π V)',
      '6.28 V (2.0π V)',
      '25.13 V (8.0π V)',
      '3.14 V (1.0π V)',
    ],
    correctAnswer: '12.57 V (4.0π V)',
    explanation:
      '|E| = dΦ/dt = B(ρ) (2π ρ) (dρ/dt) = [1.0 T][2π(0.50 m)][4.0 m/s] = 4π V ≈ 12.57 V.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'An alternating magnetic field B(t) = B₀ cos(ω t) induces eddy currents in a thin conducting sheet of thickness d and conductivity σ. How does the time-average power loss per unit volume p_eddy dissipated by eddy currents scale with frequency f and sheet thickness d?',
    options: [
      'p_eddy ∝ f² d² (Proportional to the square of both frequency and thickness)',
      'p_eddy ∝ f d',
      'p_eddy ∝ f² / d',
      'p_eddy ∝ √f d',
    ],
    correctAnswer:
      'p_eddy ∝ f² d² (Proportional to the square of both frequency and thickness)',
    explanation:
      'Induced EMF E ∝ dΦ/dt ∝ ω B₀ d ∝ f d. Power dissipation P = E² / R ∝ (f d)². This is why transformer cores use thin laminations to suppress eddy current losses.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'In general time-varying electromagnetics, using B = ∇ × A and ∇ × E = -∂B/∂t, what is the complete expression for the total electric field E in terms of scalar potential V and magnetic vector potential A?',
    options: [
      'E = -∇V - ∂A/∂t',
      'E = -∇V + ∇ × A',
      'E = -∇V + ∂A/∂t',
      'E = -∇²V - A',
    ],
    correctAnswer: 'E = -∇V - ∂A/∂t',
    explanation:
      '∇ × (E + ∂A/∂t) = 0 => E + ∂A/∂t = -∇V => E = -∇V - ∂A/∂t.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'In a Betatron particle accelerator, electrons in an orbit of radius R₀ are accelerated by an induced electric field. For the orbit radius R₀ to remain perfectly constant as the electron accelerates, what is the required Betatron 2-to-1 condition relating the average magnetic field ⟨B⟩ over the orbit area to the guide field B_orbit at the orbital track?',
    options: [
      '⟨B⟩ = 2 B_orbit (The average field over the enclosed disk must be exactly twice the guide field at the orbit)',
      '⟨B⟩ = B_orbit',
      '⟨B⟩ = (1/2) B_orbit',
      '⟨B⟩ = 4 B_orbit',
    ],
    correctAnswer:
      '⟨B⟩ = 2 B_orbit (The average field over the enclosed disk must be exactly twice the guide field at the orbit)',
    explanation:
      'Tangential accelerating force F = e E_φ = (e R₀ / 2)(d⟨B⟩/dt). The required radial guide force for constant radius is dp/dt = e R₀ (dB_orbit/dt). Equating both gives d⟨B⟩/dt = 2(dB_orbit/dt) => ⟨B⟩ = 2 B_orbit.',
  },
  {
    type: 'MCQ',
    difficulty: 'HARD',
    points: 3,
    timeLimitSeconds: 120,
    question:
      'A small circular search coil of radius r = 1.0 cm (N₁ = 50 turns) is positioned coaxially at distance z = 0.40 m along the axis of a large circular loop of radius R = 0.30 m carrying current I₂(t) = 10.0 cos(500 t) A in free space (μ₀ = 4π × 10⁻⁷ H/m). Assuming r ≪ R, what is the peak induced EMF E_1,max in the search coil?',
    options: ['35.5 μV (0.0355 mV)', '71.1 μV', '17.8 μV', '142.1 μV'],
    correctAnswer: '35.5 μV (0.0355 mV)',
    explanation:
      'B_z = [μ₀ I₂ R² / (2(R² + z²)^(3/2))] = [(4π × 10⁻⁷)(10)(0.09) / (2 * 0.125)] = 1.44π × 10⁻⁶ cos(500t) T. Flux linkage λ₁ = N₁ B_z (π r²) = 50(1.44π × 10⁻⁶)(π × 10⁻⁴) cos(500t) = 7.2π² × 10⁻⁹ cos(500t) Wb-turns. Peak induced EMF E_1,max = ω λ₁ = 500 * 7.2π² × 10⁻⁹ = 3.6π² × 10⁻⁶ V ≈ 35.53 μV.',
  },
];

async function seedFaradayLawQuiz() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/btp_fwvlab';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log(`Clearing existing Quiz questions for module="maxwell-equations", chapter="faraday-law"...`);
    await Quiz.deleteMany({ module: 'maxwell-equations', chapter: 'faraday-law' });

    console.log(`Inserting 20 questions for Faraday's Law...`);
    const doc = await Quiz.create({
      module: 'maxwell-equations',
      chapter: 'faraday-law',
      questions: faradayLawQuestions,
    });

    console.log(`Successfully created Quiz doc with ID: ${doc._id}`);
    console.log(`Total questions seeded: ${doc.questions.length}`);
    console.log(`Difficulty breakdown:`);
    console.log(`  EASY:   ${doc.questions.filter(q => q.difficulty === 'EASY').length}`);
    console.log(`  MEDIUM: ${doc.questions.filter(q => q.difficulty === 'MEDIUM').length}`);
    console.log(`  HARD:   ${doc.questions.filter(q => q.difficulty === 'HARD').length}`);
  } catch (error) {
    console.error('Error seeding quiz:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

seedFaradayLawQuiz();
