export interface QuestionItem {
  _id?: string;
  type: 'MCQ' | 'BLANK';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  timeLimitSeconds?: number;
  imageUrl?: string;
  solutionImageUrl?: string;
}

export interface ChapterQuizData {
  module: string;
  chapter: string;
  title: string;
  questions: QuestionItem[];
}

export const electrostaticsQuizzes: Record<string, ChapterQuizData> = {
  'coulombs-law': {
    module: 'electrostatics',
    chapter: 'coulombs-law',
    title: "Coulomb's Law",
    questions: [
      // ══════════════════════════════════════════════════════════
      // 🟢 EASY QUESTIONS (5 Total: 1 Existing + 4 New)
      // ══════════════════════════════════════════════════════════
      {
        _id: 'cl-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Point charges Q1 = 5 nC and Q2 = −2 nC are located at (2, 0, 4) and (−3, 0, 5), respectively. Calculate the electric force on a q = 1 nC charge placed at the point (1, −3, 7).',
        options: [
          '(-1.004i - 1.284j + 1.4k) nN',
          '(1.004i + 1.284j - 1.4k) nN',
          '(-1.284i - 1.004j + 1.4k) nN',
          '(1.284i + 1.004j - 1.4k) nN',
        ],
        correctAnswer: '(-1.004i - 1.284j + 1.4k) nN',
        explanation:
          'Calculate vector distances from the 1 nC charge to each source charge (5 nC and -2 nC), compute individual force vectors using Coulomb’s Law in 3D space, and add them.',
      },
      {
        _id: 'cl-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Two point charges q1 = +5 μC and q2 = +10 μC experience a repulsive force of 18.0 N in vacuum. If the setup is immersed in an insulating transformer oil with relative permittivity εr = 4.5 at the same distance, what is the new electrostatic force between them?',
        options: ['4.0 N', '81.0 N', '7.2 N', '0.25 N'],
        correctAnswer: '4.0 N',
        explanation:
          'In a dielectric medium, the Coulomb force is reduced by the relative permittivity: F_medium = F_vacuum / εr = 18.0 N / 4.5 = 4.0 N.',
      },
      {
        _id: 'cl-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'The electrostatic force between two stationary point charges separated by distance d is F0 = 36 mN. If the magnitude of each charge is doubled and the separation distance is tripled (3d), what is the new electrostatic force?',
        options: ['16 mN', '72 mN', '8 mN', '24 mN'],
        correctAnswer: '16 mN',
        explanation:
          'From Coulomb’s Law, F ∝ (q1 * q2) / r². Scaling gives: F\' = (2 * 2 / 3²) * F0 = (4/9) * 36 mN = 16 mN.',
      },
      {
        _id: 'cl-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'A positive charge Q1 = +4 nC is fixed at the origin (0, 0, 0), and a negative charge Q2 = -6 nC is located on the z-axis at (0, 0, 3 m). What is the unit vector in the direction of the force exerted on Q2 by Q1?',
        options: [
          '-â_z (Attractive toward origin)',
          '+â_z (Repulsive away from origin)',
          '+â_x',
          '-â_y',
        ],
        correctAnswer: '-â_z (Attractive toward origin)',
        explanation:
          'Opposite charges attract each other. The force acting on Q2 pulls it toward Q1 at the origin, which is in the -â_z direction.',
      },
      {
        _id: 'cl-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'A neutral conducting sphere acquires a net negative electrostatic charge of Q = -3.2 μC. How many excess electrons were transferred to the sphere? (e = 1.602 × 10⁻¹⁹ C)',
        options: [
          '2.0 × 10¹³ electrons',
          '5.1 × 10¹² electrons',
          '2.0 × 10¹⁹ electrons',
          '5.0 × 10¹⁴ electrons',
        ],
        correctAnswer: '2.0 × 10¹³ electrons',
        explanation:
          'Using charge quantization: N = |Q| / e = (3.2 × 10⁻⁶ C) / (1.602 × 10⁻¹⁹ C) ≈ 2.0 × 10¹³ electrons.',
      },

      // ══════════════════════════════════════════════════════════
      // 🟡 MEDIUM QUESTIONS (9 Total: 5 Existing + 4 New)
      // ══════════════════════════════════════════════════════════
      {
        _id: 'cl-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Point charges Q1 = 1 mC and Q2 = −2 mC are located at (3, 2, −1) and (−1, −1, 4) respectively. Calculate the electric force on a q = 10 nC charge placed at the point (0, 3, 1).',
        options: [
          '(-6.512i - 3.713j + 7.509k) mN',
          '(6.512i + 3.713j - 7.509k) mN',
          '(3.713i - 6.512j + 7.509k) mN',
          '(-3.713i - 6.512j + 7.509k) mN',
        ],
        correctAnswer: '(-6.512i - 3.713j + 7.509k) mN',
        explanation:
          'Compute position vectors from Q1 and Q2 to the point (0,3,1), evaluate the individual force vectors via Coulomb’s law, and vectorially sum them.',
      },
      {
        _id: 'cl-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges q1 = 2 nC and q2 = 3 nC are placed on a flat, frictionless surface, separated by a distance of 1 cm. The 2 nC charge is supported by a wall and remains stationary. What is the instantaneous acceleration of the 3 nC charge?',
        options: ['0.5394 m/s²', '0.0032 m/s²', '0.2135 m/s²', '0.9310 m/s²'],
        correctAnswer: '0.5394 m/s²',
        explanation:
          'Using F = k*q1*q2/r², F = (9e9 * 2e-9 * 3e-9) / (0.01)² = 5.4e-4 N. Given mass m = 1.0 g = 1e-3 kg, acceleration a = F/m = 0.54 m/s².',
      },
      {
        _id: 'cl-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges of 4 μC and -6 μC are separated by a distance of 3 meters in free space. What is the magnitude of the force between the charges?',
        options: ['24 N', '48 N', '72 N', '64 N'],
        correctAnswer: '72 N',
        explanation:
          'Using Coulomb’s law: F = (k * |q1| * |q2|) / r² = (9 × 10⁹ * 4 × 10⁻⁶ * 6 × 10⁻⁶) / 3² = 72 N.',
      },
      {
        _id: 'cl-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges of 2 μC and -3 μC are placed 5 cm apart. What is the magnitude of the force between them?',
        options: ['12 N', '24 N', '36 N', '60 N'],
        correctAnswer: '36 N',
        explanation:
          'Using Coulomb’s law: F = (k * |q1| * |q2|) / r² = (9 × 10⁹ * 2 × 10⁻⁶ * 3 × 10⁻⁶) / (0.05)² = 36 N magnitude.',
      },
      {
        _id: 'cl-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges, one with a charge of +2 μC and the other with a charge of -3 μC, are separated by a distance of 5 cm in free space. What is the magnitude of the force exerted on the positive charge due to the negative charge?',
        options: ['12 N', '12 μN', '12 mN', '12 kN'],
        correctAnswer: '12 μN',
        explanation:
          'Using Coulomb’s law: F = (k * q1 * q2) / r² gives the attractive force magnitude on the positive charge.',
      },
      {
        _id: 'cl-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges q1 = +4 μC and q2 = +9 μC are fixed along the x-axis at x = 0 and x = 10 cm, respectively. At what coordinate x on the line segment between them will a third charge q3 = +1 μC experience zero net electrostatic force?',
        options: ['x = 4.0 cm', 'x = 6.0 cm', 'x = 2.5 cm', 'x = 5.0 cm'],
        correctAnswer: 'x = 4.0 cm',
        explanation:
          'Setting forces equal: k*q1*q3 / x² = k*q2*q3 / (10 - x)² => √4 / x = √9 / (10 - x) => 2/x = 3/(10 - x) => 20 - 2x = 3x => 5x = 20 => x = 4.0 cm.',
      },
      {
        _id: 'cl-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges Q1 = +2 nC and Q2 = -2 nC are fixed at (3 m, 0) and (0, 4 m) in free space. What is the magnitude of the net electrostatic force acting on a test charge q0 = +1 nC placed at the origin (0, 0)? (k = 9 × 10⁹ N·m²/C²)',
        options: ['2.30 nN', '3.12 nN', '0.88 nN', '4.50 nN'],
        correctAnswer: '2.30 nN',
        explanation:
          'Fx = (9e9 * 2e-9 * 1e-9) / 3² = 2.0 nN (along -â_x). Fy = (9e9 * 2e-9 * 1e-9) / 4² = 1.125 nN (along +â_y). Net magnitude = √(2.0² + 1.125²) = 2.30 nN.',
      },
      {
        _id: 'cl-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electron (m_e = 9.11 × 10⁻³¹ kg, e = 1.602 × 10⁻¹⁹ C) is released from rest in a uniform electrostatic field of magnitude E = 2.5 kV/m. What is the magnitude of the initial acceleration experienced by the electron?',
        options: [
          '4.40 × 10¹⁴ m/s²',
          '2.74 × 10¹¹ m/s²',
          '1.75 × 10¹⁵ m/s²',
          '3.65 × 10¹³ m/s²',
        ],
        correctAnswer: '4.40 × 10¹⁴ m/s²',
        explanation:
          'a = (e * E) / m_e = (1.602 × 10⁻¹⁹ C * 2500 V/m) / (9.11 × 10⁻³¹ kg) = 4.40 × 10¹⁴ m/s².',
      },
      {
        _id: 'cl-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two identical conducting spheres, each of mass m = 10 g (0.01 kg) carrying equal charge q, are suspended from a common point by strings of length L = 1.0 m. In equilibrium, the separation distance is x = 0.10 m. Assuming small angles (tanθ ≈ x / 2L), g = 9.8 m/s², and k = 9 × 10⁹ N·m²/C², find the charge q on each sphere.',
        options: ['73.8 nC', '14.7 nC', '125.4 nC', '36.9 nC'],
        correctAnswer: '73.8 nC',
        explanation:
          'Force balance: Fe = mg * (x / 2L) = (0.01)(9.8)(0.10 / 2) = 4.9 × 10⁻³ N. Solving for q = √(Fe * x² / k) = √((4.9e-3 * 0.01) / 9e9) ≈ 73.8 nC.',
      },

      // ══════════════════════════════════════════════════════════
      // 🔴 HARD QUESTIONS (6 Total: 2 Existing + 4 New)
      // ══════════════════════════════════════════════════════════
      {
        _id: 'cl-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Four point charges of magnitude Q = 3 pC are placed at the corners of a square of side length 1 m. The charges on the left side are positive (+Q) and the charges on the right side are negative (-Q). Find the electric field E at the center of the square (relative permittivity is 1).',
        options: ['153 V/m', '612 V/m', '76.5 V/m', '0 V/m'],
        correctAnswer: '153 V/m',
        explanation:
          'Two positive and two negative charges placed symmetrically on a square generate a net electric field directed toward the negative charges. Using vector superposition E_net = 153 V/m.',
      },
      {
        _id: 'cl-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Two point charges, +3 μC and -4 μC, are separated by a distance of 0.1 m in vacuum (ε₀ = 8.85 × 10⁻¹² F/m). What is the magnitude of the force between them?',
        options: ['13.52 N', '10.26 N', '12.45 N', '16.28 N'],
        correctAnswer: '13.52 N',
        explanation:
          'Using Coulomb’s law: F = (1 / (4πε₀)) * (|q1| * |q2|) / r² = (9 × 10⁹) * (3 × 10⁻⁶ * 4 × 10⁻⁶) / (0.1)² = 108 × 10⁻³ / 0.01 = 13.52 N magnitude.',
      },
      {
        _id: 'cl-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Point charges Q1 = +12 nC at (1, 0, 2) m and Q2 = -8 nC at (0, 2, 1) m are placed in free space. Determine the z-component (Fz) of the net electrostatic force exerted on a test charge q = +2 nC located at P(1, 2, 4) m.',
        options: ['+5.43 nN', '+32.75 nN', '-8.22 nN', '+11.85 nN'],
        correctAnswer: '+5.43 nN',
        explanation:
          'From Q1: R1 = (0, 2, 2) m, |R1| = √8 m => F1z = (9e9 * 12e-9 * 2e-9 * 2) / (8^1.5) = +19.09 nN. From Q2: R2 = (1, 0, 3) m, |R2| = √10 m => F2z = (9e9 * -8e-9 * 2e-9 * 3) / (10^1.5) = -13.66 nN. Net Fz = 19.09 - 13.66 = +5.43 nN.',
      },
      {
        _id: 'cl-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Six identical point charges, each q = +3 nC, are fixed at the vertices of a regular hexagon with side length a = 0.5 m lying in the xy-plane centered at the origin. A charge Q = -1 nC is placed on the z-axis at height z = 0.5 m. What is the magnitude of the net electrostatic force acting on charge Q? (k = 9 × 10⁹ N·m²/C²)',
        options: ['229.1 nN', '114.6 nN', '0 N', '324.0 nN'],
        correctAnswer: '229.1 nN',
        explanation:
          'Distance R = √(0.5² + 0.5²) = √0.5 m. Single charge force F1 = (9e9 * 3e-9 * 1e-9) / 0.5 = 54.0 nN. Vertical component F1z = 54.0 * (0.5 / √0.5) = 38.184 nN. Horizontal forces cancel by symmetry (Fxy = 0). Total force from all 6 charges: F_net = 6 * 38.184 nN = 229.1 nN.',
      },
      {
        _id: 'cl-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A thin semicircular wire of radius R = 0.20 m lies in the xy-plane centered at the origin (y ≥ 0, from φ = 0 to φ = π). The wire carries a uniform positive line charge density ρL = +20 nC/m. What is the magnitude of the electrostatic force exerted on a point charge q0 = -2 nC placed at the origin (0, 0)? (k = 9 × 10⁹ N·m²/C²)',
        options: ['3.60 μN', '1.80 μN', '0 N', '7.20 μN'],
        correctAnswer: '3.60 μN',
        explanation:
          'By symmetry across the y-axis, Fx = 0. The net vertical attraction along +â_y is Fy = (2 * k * |q0| * ρL) / R = (2 * 9e9 * 2e-9 * 20e-9) / 0.20 = 3.60 × 10⁻⁶ N = 3.60 μN.',
      },
      {
        _id: 'cl-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Two protons (q = 1.602 × 10⁻¹⁹ C, m = 1.673 × 10⁻²⁷ kg) are placed in free space separated by distance r. What is the ratio of their electrostatic repulsive force to their gravitational attractive force (Fe / Fg)? (k = 9 × 10⁹ N·m²/C², G = 6.674 × 10⁻¹¹ N·m²/kg²)',
        options: ['1.24 × 10³⁶', '1.24 × 10⁴²', '2.15 × 10²⁴', '8.40 × 10¹⁵'],
        correctAnswer: '1.24 × 10³⁶',
        explanation:
          'Fe / Fg = (k * q²) / (G * m²) = (9 × 10⁹ * (1.602 × 10⁻¹⁹)²) / (6.674 × 10⁻¹¹ * (1.673 × 10⁻²⁷)²) ≈ 1.24 × 10³⁶.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CHAPTER 2: ELECTRIC FIELD & ELECTRIC FLUX DENSITY (20 Total)
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  // ══════════════════════════════════════════════════════════════
  'electric-flux': {
    module: 'electrostatics',
    chapter: 'electric-flux',
    title: 'Electric Field & Electric Flux Density',
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total: 1 Existing + 4 New) ──
      {
        _id: 'ef-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Point charges are placed at the corners of a square of size 4 m centered in the xy-plane. If Q = 15 μC, find the electric flux density D at (0, 0, 6).',
        options: [
          '–16.36î – 49.08ĵ nC/m²',
          '16.36î – 49.08ĵ nC/m²',
          '–49.08î – 16.36ĵ nC/m²',
          '49.08î + 16.36ĵ nC/m²',
        ],
        correctAnswer: '–16.36î – 49.08ĵ nC/m²',
        explanation:
          'Compute individual flux density contributions from each point charge at the corners to the observation point (0,0,6) using D = Q/(4π R²) a_R, and sum the vectors.',
      },
      {
        _id: 'ef-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'A dielectric material has a relative permittivity εr = 3.0. If a uniform electrostatic field of magnitude E = 4.0 kV/m is applied within the medium, what is the resulting magnitude of the electric flux density D? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: ['106.2 nC/m²', '35.4 nC/m²', '318.7 nC/m²', '11.8 nC/m²'],
        correctAnswer: '106.2 nC/m²',
        explanation:
          'Using the constitutive relation: D = εr * ε₀ * E = 3.0 * (8.854 × 10⁻¹² F/m) * (4000 V/m) = 1.0625 × 10⁻⁷ C/m² = 106.2 nC/m².',
      },
      {
        _id: 'ef-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What are the respective SI units for electric flux (Ψ) and electric flux density (D)?',
        options: [
          'Coulomb (C) and Coulomb per square meter (C/m²)',
          'Volt (V) and Volt per meter (V/m)',
          'Newton (N) and Newton per Coulomb (N/C)',
          'Weber (Wb) and Tesla (T)',
        ],
        correctAnswer: 'Coulomb (C) and Coulomb per square meter (C/m²)',
        explanation:
          'Electric flux Ψ represents total lines of electric displacement (Coulombs, C). Electric flux density D is the flux per unit surface area (C/m²).',
      },
      {
        _id: 'ef-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'An infinite line charge with a uniform linear charge density ρL = +50 nC/m lies along the z-axis in free space. What is the magnitude of the electric field E at a radial distance ρ = 2.0 m from the line? (k = 9 × 10⁹ N·m²/C²)',
        options: ['450 V/m', '900 V/m', '225 V/m', '1800 V/m'],
        correctAnswer: '450 V/m',
        explanation:
          'E = ρL / (2πε₀ ρ) = (2 * k * ρL) / ρ = (2 * 9 × 10⁹ * 50 × 10⁻⁹) / 2.0 = 450 V/m.',
      },
      {
        _id: 'ef-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'An infinite flat plane at z = 0 carries a uniform surface charge density ρs = +8.854 nC/m² in free space (ε₀ = 8.854 × 10⁻¹² F/m). What is the electric field intensity vector E at point P(2 m, -3 m, 5 m)?',
        options: [
          '+500â_z V/m',
          '-500â_z V/m',
          '+100â_z V/m',
          '+2500â_z V/m',
        ],
        correctAnswer: '+500â_z V/m',
        explanation:
          'For an infinite sheet, E = (ρs / 2ε₀) â_n. For z = 5 > 0, â_n = +â_z. E = (8.854 × 10⁻⁹) / (2 * 8.854 × 10⁻¹²) â_z = +500â_z V/m.',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total: 1 Existing + 8 New) ──
      {
        _id: 'ef-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Three point charges are located in the z = 0 plane: a charge +Q at (–1, 0), a charge +Q at (1, 0), and a charge –2Q at (0, 1). Determine the electric flux density D at (0, 0).',
        options: [
          '(Q/2π)ĵ C/m²',
          '(Q/π)î C/m²',
          '(Q/π)ĵ C/m²',
          '(2Q/π)ĵ C/m²',
        ],
        correctAnswer: '(Q/2π)ĵ C/m²',
        explanation:
          'The fields from the two identical +Q charges at (-1,0) and (1,0) cancel along the x-axis at (0,0). The only net contribution is from -2Q at (0,1), which attracts upward along +ĵ with magnitude D = (2Q)/(4π * 1²) = Q/(2π) ĵ C/m².',
      },
      {
        _id: 'ef-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A dielectric material has a relative permittivity εr = 5.0. If a uniform electric field of magnitude E = 10 kV/m exists inside the material, what is the magnitude of the polarization vector P? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: ['354.2 nC/m²', '442.7 nC/m²', '88.5 nC/m²', '177.1 nC/m²'],
        correctAnswer: '354.2 nC/m²',
        explanation:
          'Electric susceptibility χe = εr - 1 = 4.0. P = χe * ε₀ * E = 4.0 * (8.854 × 10⁻¹²) * 10000 = 3.5416 × 10⁻⁷ C/m² = 354.2 nC/m².',
      },
      {
        _id: 'ef-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two infinite parallel plates carry uniform surface charge densities ρs1 = +40 nC/m² at x = -2 cm and ρs2 = -40 nC/m² at x = +2 cm in free space (ε₀ = 8.854 × 10⁻¹² F/m). What is the electric field intensity E in the region between the plates (-2 cm < x < +2 cm)?',
        options: [
          '+4.52â_x kV/m',
          '0 V/m',
          '-4.52â_x kV/m',
          '+2.26â_x kV/m',
        ],
        correctAnswer: '+4.52â_x kV/m',
        explanation:
          'Between the plates, fields from both plates add constructively: E = (ρs / ε₀) â_x = (40 × 10⁻⁹ / 8.854 × 10⁻¹²) â_x ≈ +4.52â_x kV/m.',
      },
      {
        _id: 'ef-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two infinite line charges ρL1 = +18 nC/m along (x=0, y=0) and ρL2 = -18 nC/m along (x=4 m, y=0) run parallel to the z-axis in free space. What is the net electric field intensity E at the midpoint (2 m, 0, 0)? (k = 9 × 10⁹ N·m²/C²)',
        options: ['+324â_x V/m', '0 V/m', '+162â_x V/m', '-324â_x V/m'],
        correctAnswer: '+324â_x V/m',
        explanation:
          'E1 = (2 * 9e9 * 18e-9) / 2 = 162 V/m (along +â_x). E2 = 162 V/m (along +â_x, attractive toward negative line). E_net = (162 + 162)â_x = +324â_x V/m.',
      },
      {
        _id: 'ef-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A uniform electric flux density vector D = (6â_x - 2â_y + 3â_z) μC/m² exists in free space. What is the total electric flux Ψ passing through a rectangular surface of area 4.0 m² lying in the y = 3 plane with normal vector pointing in the +â_y direction?',
        options: ['-8.0 μC', '+24.0 μC', '+12.0 μC', '+28.0 μC'],
        correctAnswer: '-8.0 μC',
        explanation:
          'Ψ = ∫ D·dS = Dy * Area = (-2.0 μC/m²) * (4.0 m²) = -8.0 μC.',
      },
      {
        _id: 'ef-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A circular ring of radius a lying in the xy-plane carries a uniform line charge Q. At what axial coordinate z along the axis of symmetry does the electric field intensity Ez reach its maximum magnitude?',
        options: [
          'z = ± a / √2 ≈ ± 0.707 a',
          'z = ± a',
          'z = ± a / 2',
          'z = ± √2 a',
        ],
        correctAnswer: 'z = ± a / √2 ≈ ± 0.707 a',
        explanation:
          'Differentiating Ez = (Q z) / [4πε₀ (a² + z²)^(3/2)] with respect to z and equating to 0 yields (a² + z²) - 3z² = 0 => 2z² = a² => z = ± a/√2.',
      },
      {
        _id: 'ef-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A spherical volume of radius R = 2.0 m centered at the origin contains a radial charge distribution ρv(r) = 5r C/m³ (where r is the radial distance in meters). What is the total electric charge Q enclosed within the sphere?',
        options: [
          '80π C ≈ 251.3 C',
          '40π C ≈ 125.7 C',
          '160π C ≈ 502.7 C',
          '20π C ≈ 62.8 C',
        ],
        correctAnswer: '80π C ≈ 251.3 C',
        explanation:
          'Q = ∫ ρv dv = 4π ∫₀² (5r) r² dr = 4π [5r⁴ / 4]₀² = 4π * (5 * 16 / 4) = 80π C ≈ 251.3 C.',
      },
      {
        _id: 'ef-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An infinite line charge ρL = +8 nC/m lies along the z-axis, and a point charge Q = -16 nC is placed on the x-axis at x = 6.0 m. At what coordinate on the x-axis in the region x > 6.0 m is the net electric field intensity E = 0?',
        options: ['x = 9.0 m', 'x = 4.0 m', 'x = 12.0 m', 'x = 7.5 m'],
        correctAnswer: 'x = 9.0 m',
        explanation:
          'For x > 6 m: (2k * 8) / x = (k * 16) / (x - 6)² => x = (x - 6)² => x² - 13x + 36 = 0 => (x - 9)(x - 4) = 0. For region x > 6 m, root is x = 9.0 m.',
      },
      {
        _id: 'ef-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A uniform line charge of length 2L = 4.0 m (extending from z = -2 m to z = +2 m) with charge density ρL = +30 nC/m lies along the z-axis in free space. What is the magnitude of the electric field Eρ at a point on the xy-plane at radial distance ρ = 1.5 m? (k = 9 × 10⁹ N·m²/C²)',
        options: ['288 V/m', '360 V/m', '144 V/m', '576 V/m'],
        correctAnswer: '288 V/m',
        explanation:
          'Eρ = (2k ρL L) / (ρ √(ρ² + L²)) = (2 * 9e9 * 30e-9 * 2) / (1.5 * √(1.5² + 2²)) = 1080 / (1.5 * 2.5) = 1080 / 3.75 = 288 V/m.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total: 3 Existing + 3 New) ──
      {
        _id: 'ef-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Determine D at (4, 0, 3) if there is a point charge –5π mC at (4, 0, 0) and an infinite line charge 3π mC/cm along the y-axis.',
        options: [
          '240î + 41.1ĵ μC/m²',
          '–240î + 41.1ĵ μC/m²',
          '41.1î + 240ĵ μC/m²',
          '–41.1î + 240ĵ μC/m²',
        ],
        correctAnswer: '240î + 41.1ĵ μC/m²',
        explanation:
          'Compute vector flux density contribution from the point charge at (4,0,0) and the infinite line charge along the y-axis at observation point (4,0,3), and sum the vector components.',
      },
      {
        _id: 'ef-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A ring placed along y² + z² = 4, x = 0 carries a uniform line charge 5 μC/m. Find the electric flux density D at P(3, 0, 0).',
        options: [
          '0.32î μC/m²',
          '0.32ĵ μC/m²',
          '0.32k̂ μC/m²',
          '0.64î μC/m²',
        ],
        correctAnswer: '0.32î μC/m²',
        explanation:
          'Using the circular ring flux formula on axis: Dx = (ρL a x) / [2 (a² + x²)^(3/2)] where radius a = 2, distance x = 3. Dx = (5e-6 * 2 * 3) / [2 * (4 + 9)^(1.5)] = 30e-6 / (2 * 46.87) ≈ 0.32î μC/m².',
      },
      {
        _id: 'ef-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A ring placed along y² + z² = 4, x = 0 carries a uniform charge 5 μC/m. If two identical point charges Q are placed at (0, –3, 0) and (0, 3, 0) in addition to the ring, find the value of Q such that D = 0 at P(3, 0, 0).',
        options: ['–51.2 mC', '–25.6 mC', '–102.4 mC', '–12.8 mC'],
        correctAnswer: '–51.2 mC',
        explanation:
          'Set the axial flux density of the ring equal and opposite to the combined axial flux density from the two point charges at (0,±3,0) and solve for Q = –51.2 mC.',
      },
      {
        _id: 'ef-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A circular disk of radius a = 3.0 m lying in the z = 0 plane centered at the origin carries a uniform surface charge density ρs = +53.124 nC/m². What is the electric field intensity vector E at point P(0, 0, 4.0 m) on the z-axis? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '+600â_z V/m',
          '+2400â_z V/m',
          '+1500â_z V/m',
          '+3000â_z V/m',
        ],
        correctAnswer: '+600â_z V/m',
        explanation:
          'Ez = (ρs / 2ε₀) [1 - z / √(a² + z²)] = [53.124e-9 / (2 * 8.854e-12)] * [1 - 4.0 / √(3² + 4²)] = 3000 * [1 - 4/5] = 3000 * 0.20 = +600â_z V/m.',
      },
      {
        _id: 'ef-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'The electric flux density in a region is given by D = (2x²y â_x + 3y²z â_y + 4xz â_z) C/m². What is the total outward electric flux Ψ passing through the closed boundary of a unit cube defined by 0 ≤ x ≤ 1, 0 ≤ y ≤ 1, 0 ≤ z ≤ 1?',
        options: ['4.5 C', '2.25 C', '9.0 C', '0 C'],
        correctAnswer: '4.5 C',
        explanation:
          'Applying Divergence Theorem: Ψ = ∭ (∇·D) dV = ∭ (4xy + 6yz + 4x) dxdydz = 4(0.5)(0.5)(1) + 6(1)(0.5)(0.5) + 4(0.5)(1)(1) = 1.0 + 1.5 + 2.0 = 4.5 C.',
      },
      {
        _id: 'ef-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A solid sphere of radius R = 1.0 m centered at the origin contains a volume charge density ρv(r) = ρ0 (1 - r² / R²), where ρ0 = +30 nC/m³. What is the magnitude of the electric flux density Dr at the internal radial distance r = 0.5 m?',
        options: ['4.25 nC/m²', '5.00 nC/m²', '2.50 nC/m²', '8.50 nC/m²'],
        correctAnswer: '4.25 nC/m²',
        explanation:
          'Using Gauss’s law: Dr = ρ0 [r/3 - r³ / (5 R²)] = 30 * [0.5/3 - 0.125/5] = 30 * [0.16667 - 0.0250] = 30 * 0.14167 = 4.25 nC/m².',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CHAPTER 3: ELECTRIC DIPOLE (20 Total)
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  // ══════════════════════════════════════════════════════════════
  'electric-dipole': {
    module: 'electrostatics',
    chapter: 'electric-dipole',
    title: 'Electric Dipole',
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'ed-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the definition and vector direction of the electric dipole moment (p) formed by two equal and opposite point charges +q and -q separated by distance d?',
        options: [
          'p = qd, pointing from the negative charge (-q) to the positive charge (+q)',
          'p = qd, pointing from the positive charge (+q) to the negative charge (-q)',
          'p = (q/d)â_r, pointing radially outward from the midpoint',
          'p = 2qd, pointing in the direction of the electric field lines',
        ],
        correctAnswer:
          'p = qd, pointing from the negative charge (-q) to the positive charge (+q)',
        explanation:
          'By physical and engineering convention, the electric dipole moment is defined as p = qd, with the displacement vector d directed from -q toward +q.',
      },
      {
        _id: 'ed-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the standard SI unit of electric dipole moment (p)?',
        options: [
          'Coulomb-meter (C·m)',
          'Coulomb per meter (C/m)',
          'Volt-meter (V·m)',
          'Newton per Coulomb (N/C)',
        ],
        correctAnswer: 'Coulomb-meter (C·m)',
        explanation:
          'Since dipole moment is charge multiplied by distance (p = q * d), its SI unit is Coulomb × meter = C·m.',
      },
      {
        _id: 'ed-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'An electric dipole oriented along the z-axis is centered at the origin. What is the electrostatic potential V at any observation point on the equatorial xy-plane (z = 0, θ = 90°)?',
        options: [
          'V = 0 V',
          'V = p / (4πε₀ r²)',
          'V = 2p / (4πε₀ r²)',
          'V = -p / (4πε₀ r²)',
        ],
        correctAnswer: 'V = 0 V',
        explanation:
          'V(r, θ) = (p cosθ) / (4πε₀ r²). For any point on the equatorial plane, θ = 90° => cos(90°) = 0 => V = 0 V.',
      },
      {
        _id: 'ed-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'A pair of equal and opposite point charges +5.0 nC and -5.0 nC are separated by a small distance d = 2.0 mm. What is the magnitude of the dipole moment p?',
        options: [
          '1.0 × 10⁻¹¹ C·m (10 pC·m)',
          '2.5 × 10⁻¹² C·m',
          '5.0 × 10⁻⁹ C·m',
          '1.0 × 10⁻⁸ C·m',
        ],
        correctAnswer: '1.0 × 10⁻¹¹ C·m (10 pC·m)',
        explanation:
          'p = q * d = (5.0 × 10⁻⁹ C) * (2.0 × 10⁻³ m) = 1.0 × 10⁻¹¹ C·m = 10 pC·m.',
      },
      {
        _id: 'ed-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'At a far-field distance (r ≫ d), how do the electrostatic potential V and electric field magnitude E of a point dipole scale with radial distance r?',
        options: [
          'V ∝ 1/r² and E ∝ 1/r³',
          'V ∝ 1/r and E ∝ 1/r²',
          'V ∝ 1/r³ and E ∝ 1/r⁴',
          'V ∝ 1/r² and E ∝ 1/r²',
        ],
        correctAnswer: 'V ∝ 1/r² and E ∝ 1/r³',
        explanation:
          'For a point dipole: V(r) = (p cosθ) / (4πε₀ r²) ∝ 1/r², and E(r) = [p √(1 + 3cos²θ)] / (4πε₀ r³) ∝ 1/r³.',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'ed-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'For an electric dipole of moment p, what is the ratio of the magnitude of the electric field intensity at an axial point (E_axial at θ = 0°) to that at an equatorial point (E_eq at θ = 90°) located at the exact same radial distance r?',
        options: [
          '2.0 (E_axial = 2 E_eq)',
          '1.0 (E_axial = E_eq)',
          '4.0 (E_axial = 4 E_eq)',
          '0.5 (E_axial = 0.5 E_eq)',
        ],
        correctAnswer: '2.0 (E_axial = 2 E_eq)',
        explanation:
          'E_axial = (2p) / (4πε₀ r³), E_eq = p / (4πε₀ r³) => E_axial / E_eq = 2.0.',
      },
      {
        _id: 'ed-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electric dipole of moment p = 4.0 × 10⁻¹⁰ C·m is placed in a uniform electric field E_ext = 5.0 × 10⁴ V/m at an angle of θ = 30° relative to the field lines. What is the magnitude of the torque τ exerted on the dipole?',
        options: [
          '10.0 μN·m (1.0 × 10⁻⁵ N·m)',
          '20.0 μN·m',
          '17.3 μN·m',
          '5.0 μN·m',
        ],
        correctAnswer: '10.0 μN·m (1.0 × 10⁻⁵ N·m)',
        explanation:
          'τ = |p × E| = p * E * sinθ = (4.0 × 10⁻¹⁰ C·m) * (5.0 × 10⁴ V/m) * sin(30°) = (2.0 × 10⁻⁵) * 0.5 = 1.0 × 10⁻⁵ N·m = 10.0 μN·m.',
      },
      {
        _id: 'ed-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electric dipole of moment p = 6.0 × 10⁻¹² C·m is oriented at an angle θ = 60° with respect to a uniform electric field E_ext = 2.0 × 10⁵ V/m. What is the electrostatic potential energy U of the dipole?',
        options: [
          '-0.60 μJ (-6.0 × 10⁻⁷ J)',
          '+0.60 μJ',
          '-1.04 μJ',
          '-1.20 μJ',
        ],
        correctAnswer: '-0.60 μJ (-6.0 × 10⁻⁷ J)',
        explanation:
          'U = -p·E = -p * E * cosθ = -(6.0 × 10⁻¹² C·m) * (2.0 × 10⁵ V/m) * cos(60°) = -(1.2 × 10⁻⁶) * 0.5 = -6.0 × 10⁻⁷ J = -0.60 μJ.',
      },
      {
        _id: 'ed-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electric dipole with moment p = 2.0 × 10⁻¹⁰ C·m is initially in stable equilibrium (θ = 0°) aligned with a uniform electric field E_ext = 3.0 × 10⁴ V/m. How much external work W is required to rotate the dipole by 180° to the unstable equilibrium orientation (θ = 180°)?',
        options: [
          '12.0 μJ (1.2 × 10⁻⁵ J)',
          '6.0 μJ',
          '0 J',
          '24.0 μJ',
        ],
        correctAnswer: '12.0 μJ (1.2 × 10⁻⁵ J)',
        explanation:
          'W = U(180°) - U(0°) = [-pE cos(180°)] - [-pE cos(0°)] = (+pE) - (-pE) = 2pE = 2 * (2.0 × 10⁻¹⁰ C·m) * (3.0 × 10⁴ V/m) = 1.2 × 10⁻⁵ J = 12.0 μJ.',
      },
      {
        _id: 'ed-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electric dipole of moment p = 8.0 × 10⁻¹¹ C·m â_z is centered at the origin. What is the electric potential V at an observation point P at distance r = 2.0 m and polar angle θ = 60°? (k = 9 × 10⁹ N·m²/C²)',
        options: ['90 mV (0.090 V)', '180 mV (0.180 V)', '45 mV (0.045 V)', '360 mV (0.360 V)'],
        correctAnswer: '90 mV (0.090 V)',
        explanation:
          'V = (k * p * cosθ) / r² = (9 × 10⁹ * 8.0 × 10⁻¹¹ * cos(60°)) / (2.0)² = (0.72 * 0.5) / 4.0 = 0.36 / 4.0 = 0.090 V = 90 mV.',
      },
      {
        _id: 'ed-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A point dipole of moment p = 10.0 nC·m â_z is located at the origin in free space (k = 9 × 10⁹ N·m²/C²). What is the magnitude of the electric field intensity E at distance r = 1.0 m and polar angle θ = 45°?',
        options: ['142.3 V/m', '90.0 V/m', '180.0 V/m', '127.3 V/m'],
        correctAnswer: '142.3 V/m',
        explanation:
          'E = (k * p / r³) * √(1 + 3cos²θ) = (9 × 10⁹ * 10 × 10⁻⁹ / 1.0³) * √(1 + 3cos²(45°)) = 90 * √(1 + 1.5) = 90 * √2.5 = 90 * 1.5811 = 142.3 V/m.',
      },
      {
        _id: 'ed-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'At a point (r, θ) in the field of a point dipole, if the polar coordinate angle is θ = 60°, what angle α does the total electric field vector E make with the radial unit vector â_r?',
        options: ['40.9°', '60.0°', '30.0°', '49.1°'],
        correctAnswer: '40.9°',
        explanation:
          'tanα = E_θ / E_r = (sinθ) / (2cosθ) = (1/2) tanθ = (1/2) tan(60°) = √3 / 2 ≈ 0.8660 => α = tan⁻¹(0.8660) = 40.89° ≈ 40.9°.',
      },
      {
        _id: 'ed-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'When an electric dipole p is placed in (i) a uniform electric field E₁ and (ii) a non-uniform electric field E₂, which statement correctly describes the net translational force F_net experienced by the dipole?',
        options: [
          'F_net = 0 in the uniform field, but F_net ≠ 0 (given by F = (p·∇)E) in the non-uniform field',
          'F_net = 0 in both uniform and non-uniform fields',
          'F_net ≠ 0 in both uniform and non-uniform fields',
          'F_net = p × E in both cases',
        ],
        correctAnswer:
          'F_net = 0 in the uniform field, but F_net ≠ 0 (given by F = (p·∇)E) in the non-uniform field',
        explanation:
          'In a uniform field, +q and -q experience equal and opposite forces, summing to zero. In a non-uniform field, field strengths differ at +q and -q, resulting in net force F = (p·∇)E.',
      },
      {
        _id: 'ed-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An electric dipole p = +p â_z is located at the origin. At an observation point along the positive x-axis (x, 0, 0), what is the direction of the resulting electric field vector E?',
        options: [
          '-â_z (Anti-parallel to p)',
          '+â_z (Parallel to p)',
          '+â_x (Radially outward)',
          '-â_y',
        ],
        correctAnswer: '-â_z (Anti-parallel to p)',
        explanation:
          'At θ = 90° (equatorial plane), E_r = 0 and E_θ â_θ = (kp / r³) â_θ. At z = 0, the unit vector â_θ points in -â_z direction, opposite to dipole moment p.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'ed-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A point electric dipole with moment p = 4.0 nC·m â_z is located at the origin in free space (k = 9 × 10⁹ N·m²/C²). Using the coordinate-free formula E(r) = (1 / 4πε₀ r⁵) [3(p·r)r - r² p], what is the electric field intensity vector E at point P(3 m, 0, 4 m)?',
        options: [
          '(0.415â_x + 0.265â_z) V/m',
          '(0.265â_x + 0.415â_z) V/m',
          '(0.576â_x + 0.768â_z) V/m',
          '(0.144â_x + 0.092â_z) V/m',
        ],
        correctAnswer: '(0.415â_x + 0.265â_z) V/m',
        explanation:
          'r = 3â_x + 4â_z, r = 5 m, r⁵ = 3125. p·r = 4 * 4 = 16 nC·m². 3(p·r)r = 48(3â_x + 4â_z) = 144â_x + 192â_z. r² p = 25 * 4â_z = 100â_z. E = (9 / 3125) [144â_x + 92â_z] = (0.4147â_x + 0.2650â_z) V/m.',
      },
      {
        _id: 'ed-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'An electric dipole p = 2.0 μC·m â_z is located on the z-axis in a non-uniform electric field E(z) = (50 z² + 200 z)â_z V/m. What is the net translational force F exerted on the dipole at position z = 3.0 m?',
        options: [
          '+1.0â_z mN (1.0 × 10⁻³â_z N)',
          '+2.1â_z mN',
          '+0.5â_z mN',
          '0 N',
        ],
        correctAnswer: '+1.0â_z mN (1.0 × 10⁻³â_z N)',
        explanation:
          'F = p_z (∂E_z/∂z) â_z. ∂E_z/∂z = 100z + 200 => at z=3: 100(3) + 200 = 500 V/m². F = (2.0 × 10⁻⁶ C·m) * (500) â_z = 1.0 × 10⁻³â_z N = +1.0â_z mN.',
      },
      {
        _id: 'ed-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A physical dipole with moment p = 5.0 × 10⁻⁸ C·m and moment of inertia I = 2.0 × 10⁻⁶ kg·m² is suspended in a uniform electric field E_ext = 4.0 × 10⁴ V/m. When displaced by a small angle θ from its equilibrium alignment, what is its natural frequency of small-angle torsional oscillation f₀?',
        options: ['5.03 Hz (ω₀ = 31.6 rad/s)', '31.62 Hz', '2.52 Hz', '10.06 Hz'],
        correctAnswer: '5.03 Hz (ω₀ = 31.6 rad/s)',
        explanation:
          'ω₀ = √(pE / I) = √((5.0 × 10⁻⁸ * 4.0 × 10⁴) / (2.0 × 10⁻⁶)) = √(2.0 × 10⁻³ / 2.0 × 10⁻⁶) = √1000 ≈ 31.62 rad/s. f₀ = ω₀ / 2π = 31.62 / 6.283 ≈ 5.03 Hz.',
      },
      {
        _id: 'ed-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Two identical electric dipoles p₁ = p â_z and p₂ = p â_z (p = 1.0 × 10⁻¹⁰ C·m) are located along the z-axis separated by distance r = 0.10 m (collinear orientation). What is the electrostatic interaction potential energy U between them? (k = 9 × 10⁹ N·m²/C²)',
        options: [
          '-0.18 μJ (-1.8 × 10⁻⁷ J, Attractive)',
          '+0.18 μJ (+1.8 × 10⁻⁷ J, Repulsive)',
          '-0.09 μJ',
          '0 J',
        ],
        correctAnswer: '-0.18 μJ (-1.8 × 10⁻⁷ J, Attractive)',
        explanation:
          'E₁ at dipole 2 is (2kp / r³) â_z. U = -p₂·E₁ = -2kp² / r³ = -(2 * 9e9 * (1.0e-10)²) / (0.10)³ = -1.8 × 10⁻⁷ J = -0.18 μJ.',
      },
      {
        _id: 'ed-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A linear electric quadrupole is constructed from two opposing collinear dipoles placed back-to-back at the origin (charges +q at z = +d, -2q at z = 0, and +q at z = -d). At a far distance r ≫ d, how do the electrostatic potential V and electric field E scale with radial distance r?',
        options: [
          'V ∝ 1/r³ and E ∝ 1/r⁴',
          'V ∝ 1/r² and E ∝ 1/r³',
          'V ∝ 1/r⁴ and E ∝ 1/r⁵',
          'V ∝ 1/r and E ∝ 1/r²',
        ],
        correctAnswer: 'V ∝ 1/r³ and E ∝ 1/r⁴',
        explanation:
          'In multipole expansion: Monopole (V ∝ 1/r, E ∝ 1/r²), Dipole (V ∝ 1/r², E ∝ 1/r³), Quadrupole (V ∝ 1/r³, E ∝ 1/r⁴).',
      },
      {
        _id: 'ed-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'An electric dipole p = 2.0 nC·m â_z is located at position Q(0, 0, 2 m) (shifted along the z-axis). What is the electrostatic potential V at the observation point P(0, 4 m, 2 m)? (k = 9 × 10⁹ N·m²/C²)',
        options: ['0 V', '1.125 V', '2.250 V', '4.500 V'],
        correctAnswer: '0 V',
        explanation:
          'Displacement vector R = r_P - r_Q = (0, 4, 2) - (0, 0, 2) = 4â_y m. p·R = (2.0â_z)·(4â_y) = 0. V = k(p·R)/R³ = 0 V (point P lies in the dipole’s equatorial bisecting plane).',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CHAPTER 4: ELECTRIC POTENTIAL (20 Total)
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  // ══════════════════════════════════════════════════════════════
  'electric-potential': {
    module: 'electrostatics',
    chapter: 'electric-potential',
    title: 'Electric Potential',
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'ep-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the physical relationship between the electrostatic potential difference V_AB = V_B - V_A and the electric field E along a path from point A to point B?',
        options: [
          'V_AB = -∫_A^B E · dl',
          'V_AB = +∫_A^B E · dl',
          'V_AB = -∇ × E',
          'V_AB = E · (B - A)',
        ],
        correctAnswer: 'V_AB = -∫_A^B E · dl',
        explanation:
          'By definition, the electric potential difference V_AB = V_B - V_A represents the external work per unit charge done against the electric field, given by V_AB = -∫_A^B E · dl.',
      },
      {
        _id: 'ep-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the electrostatic potential V at distance r = 3.0 m in free space from a positive point charge Q = +6.0 nC with the reference V(∞) = 0? (k = 9 × 10⁹ N·m²/C²)',
        options: ['18.0 V', '6.0 V', '54.0 V', '2.0 V'],
        correctAnswer: '18.0 V',
        explanation:
          'V = (k * Q) / r = (9 × 10⁹ N·m²/C² * 6.0 × 10⁻⁹ C) / (3.0 m) = 18.0 V.',
      },
      {
        _id: 'ep-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Which of the following fundamental properties correctly characterizes electrostatic equipotential surfaces?',
        options: [
          'Electric field lines are everywhere perpendicular (orthogonal) to equipotential surfaces, and no work is done moving a charge along an equipotential surface.',
          'Electric field lines are always tangent to equipotential surfaces.',
          'Equipotential surfaces can intersect each other at regions of high field strength.',
          'Work done moving a charge between two points on the same equipotential surface depends on the path taken.',
        ],
        correctAnswer:
          'Electric field lines are everywhere perpendicular (orthogonal) to equipotential surfaces, and no work is done moving a charge along an equipotential surface.',
        explanation:
          'Since dV = -E · dl = 0 along an equipotential surface, E must be orthogonal to any displacement dl on that surface, requiring zero work (W = qΔV = 0).',
      },
      {
        _id: 'ep-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'How much external work W is required to move a point charge q = -4.0 μC from a point A with potential V_A = +20 V to a point B with potential V_B = +70 V?',
        options: ['-200 μJ (-0.20 mJ)', '+200 μJ (+0.20 mJ)', '-280 μJ', '+80 μJ'],
        correctAnswer: '-200 μJ (-0.20 mJ)',
        explanation:
          'W = q(V_B - V_A) = (-4.0 × 10⁻⁶ C) * (70 V - 20 V) = -200 μJ = -0.20 mJ (the field does positive work).',
      },
      {
        _id: 'ep-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'If the electric potential in a Cartesian region is given by V(x, y, z) = 4x² - 3y + 5z (V), what is the vector electric field intensity E?',
        options: [
          '(-8xâ_x + 3â_y - 5â_z) V/m',
          '(8xâ_x - 3â_y + 5â_z) V/m',
          '(-8xâ_x - 3â_y - 5â_z) V/m',
          '(4xâ_x - 3â_y + 5â_z) V/m',
        ],
        correctAnswer: '(-8xâ_x + 3â_y - 5â_z) V/m',
        explanation:
          'Using E = -∇V: E = -[∂(4x²)/∂x â_x + ∂(-3y)/∂y â_y + ∂(5z)/∂z â_z] = -8xâ_x + 3â_y - 5â_z V/m.',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'ep-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two point charges Q₁ = +8.0 nC and Q₂ = -4.0 nC are fixed on the x-axis at x = -2.0 m and x = +4.0 m, respectively. What is the net electrostatic potential V at the origin (0, 0, 0) with V(∞) = 0? (k = 9 × 10⁹ N·m²/C²)',
        options: ['27.0 V', '45.0 V', '18.0 V', '9.0 V'],
        correctAnswer: '27.0 V',
        explanation:
          'V = (k * Q₁) / r₁ + (k * Q₂) / r₂ = 9 × 10⁹ * [(8.0 × 10⁻⁹ / 2.0) + (-4.0 × 10⁻⁹ / 4.0)] = 9 * (4.0 - 1.0) = 27.0 V.',
      },
      {
        _id: 'ep-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'In a uniform electric field E = (200â_x + 400â_y) V/m, calculate the potential difference V_AB = V_B - V_A between point A(1 m, 1 m, 0) and point B(4 m, 5 m, 0).',
        options: ['-2200 V (-2.20 kV)', '+2200 V (+2.20 kV)', '-1400 V', '-1000 V'],
        correctAnswer: '-2200 V (-2.20 kV)',
        explanation:
          'For uniform E: V_AB = -E · (r_B - r_A) = -(200 * (4 - 1) + 400 * (5 - 1)) = -(600 + 1600) = -2200 V = -2.20 kV.',
      },
      {
        _id: 'ep-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A uniform line charge with charge density ρ_L = 20 nC/m lies along the z-axis in free space. What is the potential difference V_AB = V_A - V_B between radial distances ρ_A = 2.0 m and ρ_B = 6.0 m? (k = 9 × 10⁹ N·m²/C²)',
        options: ['395.5 V', '180.2 V', '540.8 V', '791.0 V'],
        correctAnswer: '395.5 V',
        explanation:
          'V_A - V_B = 2k ρ_L ln(ρ_B / ρ_A) = 2(9 × 10⁹)(20 × 10⁻⁹) ln(6.0 / 2.0) = 360 * ln(3) = 360 * 1.0986 = 395.5 V.',
      },
      {
        _id: 'ep-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A thin circular ring of radius a = 4.0 m lying in the xy-plane centered at the origin carries a total uniform charge Q = +15 nC. What is the electrostatic potential V at a point P(0, 0, 3 m) on the z-axis? (k = 9 × 10⁹ N·m²/C²)',
        options: ['27.0 V', '45.0 V', '33.75 V', '18.0 V'],
        correctAnswer: '27.0 V',
        explanation:
          'All charge elements of the ring are at equal distance r = √(a² + z²) = √(4² + 3²) = 5.0 m. V = (k * Q) / r = (9 × 10⁹ * 15 × 10⁻⁹) / 5.0 = 27.0 V.',
      },
      {
        _id: 'ep-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A uniformly charged circular disk of radius a = 3.0 m in the z = 0 plane has surface charge density ρ_s = +17.708 nC/m². What is the electrostatic potential V on the z-axis at z = 4.0 m? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: ['1000 V (1.0 kV)', '500 V (0.5 kV)', '2000 V (2.0 kV)', '250 V'],
        correctAnswer: '1000 V (1.0 kV)',
        explanation:
          'V(z) = (ρ_s / 2ε₀) [√(a² + z²) - z] = [17.708 × 10⁻⁹ / (2 * 8.854 × 10⁻¹²)] * [√(3² + 4²) - 4] = 1000 * (5.0 - 4.0) = 1000 V.',
      },
      {
        _id: 'ep-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An isolated spherical conductor of radius R = 0.20 m holds a total charge Q = +10 nC in free space. What is the electrostatic potential at an internal point r = 0.10 m from the center? (k = 9 × 10⁹ N·m²/C²)',
        options: ['450 V', '900 V', '0 V', '225 V'],
        correctAnswer: '450 V',
        explanation:
          'Inside a conducting sphere at electrostatic equilibrium, E = 0, so the entire interior is an equipotential volume at V(r) = V(R) = (k * Q) / R = (9 × 10⁹ * 10 × 10⁻⁹) / 0.20 = 450 V.',
      },
      {
        _id: 'ep-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A proton (q = +1.602 × 10⁻¹⁹ C, m = 1.67 × 10⁻²⁷ kg) is accelerated from rest through an electrostatic potential difference of ΔV = 500 V. What is the final speed v acquired by the proton?',
        options: [
          '3.10 × 10⁵ m/s (310 km/s)',
          '1.55 × 10⁵ m/s',
          '9.60 × 10⁶ m/s',
          '4.38 × 10⁵ m/s',
        ],
        correctAnswer: '3.10 × 10⁵ m/s (310 km/s)',
        explanation:
          'v = √(2qΔV / m) = √((2 * 1.602 × 10⁻¹⁹ * 500) / (1.67 × 10⁻²⁷)) = √(1.602 × 10⁻¹⁶ / 1.67 × 10⁻²⁷) ≈ 3.10 × 10⁵ m/s = 310 km/s.',
      },
      {
        _id: 'ep-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'In cylindrical coordinates, the electric potential is given by V(ρ, φ) = 50 ρ² cos(2φ) V. What is the magnitude of the electric field intensity E at the point (ρ = 2.0 m, φ = 30°)?',
        options: ['200 V/m', '100 V/m', '173.2 V/m', '400 V/m'],
        correctAnswer: '200 V/m',
        explanation:
          'E_ρ = -∂V/∂ρ = -100ρ cos(2φ) = -100(2)(0.5) = -100 V/m. E_φ = -(1/ρ)∂V/∂φ = 100ρ sin(2φ) = 100(2)(√3/2) = 173.2 V/m. |E| = √((-100)² + 173.2²) = √40000 = 200 V/m.',
      },
      {
        _id: 'ep-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A parallel-plate capacitor with plate area A = 0.05 m² and plate separation d = 2.0 mm is filled with a dielectric of relative permittivity ε_r = 4.0 and charged to a potential difference V₀ = 100 V. What is the total electrostatic energy W_E stored in the capacitor? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '4.43 μJ (4.427 × 10⁻⁶ J)',
          '8.85 μJ',
          '2.21 μJ',
          '17.71 μJ',
        ],
        correctAnswer: '4.43 μJ (4.427 × 10⁻⁶ J)',
        explanation:
          'C = (ε_r ε₀ A) / d = (4 * 8.854 × 10⁻¹² * 0.05) / 0.002 = 885.4 pF. W_E = 0.5 * C * V₀² = 0.5 * (8.854 × 10⁻¹⁰) * (100)² = 4.427 × 10⁻⁶ J = 4.43 μJ.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'ep-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Three equal point charges Q = +2.0 μC are placed at the vertices of an equilateral triangle of side length s = 0.30 m in free space (k = 9 × 10⁹ N·m²/C²). What is the total electrostatic energy W_E assembled in this configuration?',
        options: [
          '0.360 J (360 mJ)',
          '0.120 J (120 mJ)',
          '0.720 J',
          '1.080 J',
        ],
        correctAnswer: '0.360 J (360 mJ)',
        explanation:
          'W_E = 3 * (k * Q² / s) = 3 * [9 × 10⁹ * (2.0 × 10⁻⁶)² / 0.30] = 3 * (0.036 / 0.30) = 0.360 J = 360 mJ.',
      },
      {
        _id: 'ep-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A non-conducting solid sphere of radius R = 0.50 m carries a uniform volume charge density ρ_v = +60 nC/m³ throughout its volume. Taking the reference potential V(∞) = 0, what is the electrostatic potential V₀ at the center (r = 0) of the sphere? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: ['847.1 V', '564.7 V', '1129.4 V', '282.4 V'],
        correctAnswer: '847.1 V',
        explanation:
          'At center r = 0: V(0) = (3/2) V(R) = (ρ_v R²) / (2ε₀) = (60 × 10⁻⁹ * 0.25) / (2 * 8.854 × 10⁻¹²) = 847.1 V (which is 1.5 times the surface potential V(R) = 564.7 V).',
      },
      {
        _id: 'ep-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Given the electrostatic potential in spherical coordinates V(r) = (V₀ / r) e^(-αr) (Yukawa / screened Coulomb potential, where V₀ and α are positive constants), what is the corresponding volume charge density ρ_v(r) in the region r > 0?',
        options: [
          '–(ε₀ α² V₀ / r) e^(-αr)',
          '+(ε₀ α² V₀ / r) e^(-αr)',
          '–(ε₀ α V₀ / r²) e^(-αr)',
          '0 C/m³',
        ],
        correctAnswer: '–(ε₀ α² V₀ / r) e^(-αr)',
        explanation:
          'Using Poisson’s equation ∇²V = -ρ_v / ε₀: ∇²V = (1/r²) d/dr [r² dV/dr] = α² (V₀/r) e^(-αr) = α² V(r). Hence ρ_v = -ε₀ α² V = -(ε₀ α² V₀ / r) e^(-αr).',
      },
      {
        _id: 'ep-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A coaxial cylindrical cable consists of an inner conductor of radius a = 2.0 mm and an outer conducting sheath of radius b = 8.0 mm, separated by a dielectric of relative permittivity ε_r = 2.5. If the voltage applied between the conductors is V₀ = 500 V, what is the maximum electric field intensity E_max within the dielectric?',
        options: [
          '180.3 kV/m (1.803 × 10⁵ V/m)',
          '45.1 kV/m',
          '360.6 kV/m',
          '90.2 kV/m',
        ],
        correctAnswer: '180.3 kV/m (1.803 × 10⁵ V/m)',
        explanation:
          'E(ρ) = V₀ / [ρ ln(b/a)]. The maximum field occurs at the inner conductor surface ρ = a: E_max = 500 / [0.002 * ln(4)] = 500 / 0.002773 ≈ 180.3 kV/m.',
      },
      {
        _id: 'ep-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Two concentric spherical conducting shells have radii a = 5.0 cm and b = 15.0 cm. The space between them is filled with air (ε_r = 1.0). If the inner sphere is maintained at V = 600 V and the outer sphere is grounded (V = 0 V), what is the total electrostatic energy W_E stored in the system? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '1.50 μJ (1.502 × 10⁻⁶ J)',
          '3.00 μJ',
          '0.75 μJ',
          '6.01 μJ',
        ],
        correctAnswer: '1.50 μJ (1.502 × 10⁻⁶ J)',
        explanation:
          'C = 4πε₀ / (1/a - 1/b) = (4π * 8.854 × 10⁻¹²) / (20 - 6.667) = 1.113 × 10⁻¹⁰ / 13.333 = 8.345 pF. W_E = 0.5 * C * V² = 0.5 * (8.345 × 10⁻¹²) * (600)² = 1.502 μJ.',
      },
      {
        _id: 'ep-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A grounded conducting plane occupies the z = 0 boundary. A positive point charge Q = +8.0 nC is placed at position (0, 0, d) where d = 3.0 m. Using the method of images (k = 9 × 10⁹ N·m²/C²), calculate the electrostatic potential V at the observation point P(4.0 m, 0, 3.0 m) in the upper half-space (z > 0).',
        options: ['8.02 V', '18.00 V', '9.98 V', '0 V'],
        correctAnswer: '8.02 V',
        explanation:
          'By method of images, V(P) = (k * Q / r₁) - (k * Q / r₂) where r₁ = 4.0 m (distance to real charge) and r₂ = √(4² + 6²) = √52 ≈ 7.211 m (distance to image charge). V(P) = 72 * (0.25 - 0.1387) = 8.02 V.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CHAPTER 5: GAUSS'S LAW (20 Total)
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  // ══════════════════════════════════════════════════════════════
  'gauss-law': {
    module: 'electrostatics',
    chapter: 'gauss-law',
    title: "Gauss's Law",
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'gl-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the integral form of Gauss’s Law in electrostatics relating total outward electric flux Ψ across a closed surface S to the total enclosed charge Q_enc?',
        options: [
          '∮_S D · dS = Q_enc',
          '∮_S D · dl = Q_enc',
          '∮_S E · dS = μ₀ Q_enc',
          '∮_S D × dS = Q_enc',
        ],
        correctAnswer: '∮_S D · dS = Q_enc',
        explanation:
          'Gauss’s Law states that the net outward electric flux Ψ through any closed surface is equal to the total charge enclosed by that surface: Ψ = ∮_S D · dS = Q_enc = ∫_V ρ_v dV.',
      },
      {
        _id: 'gl-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Which differential relation expresses Maxwell’s first equation (Gauss’s Law in point form) in electrostatics?',
        options: [
          '∇ · D = ρ_v',
          '∇ × D = ρ_v',
          '∇² D = 0',
          '∇ · E = 0',
        ],
        correctAnswer: '∇ · D = ρ_v',
        explanation:
          'Applying the Divergence Theorem to the integral form ∮_S D · dS = ∫_V ρ_v dV yields ∫_V (∇ · D - ρ_v) dV = 0, giving the point form ∇ · D = ρ_v.',
      },
      {
        _id: 'gl-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'A closed Gaussian surface encloses four point charges: q₁ = +5.0 nC, q₂ = -8.0 nC, q₃ = +12.0 nC, and q₄ = -3.0 nC. A fifth charge q₅ = +20.0 nC is located outside the surface. What is the net outward electric flux Ψ = ∮ D · dS passing through the Gaussian surface?',
        options: ['+6.0 nC', '+26.0 nC', '-6.0 nC', '0 nC'],
        correctAnswer: '+6.0 nC',
        explanation:
          'By Gauss’s Law, only charges enclosed within the surface contribute to net outward flux: Q_enc = q₁ + q₂ + q₃ + q₄ = (+5.0) + (-8.0) + (+12.0) + (-3.0) = +6.0 nC. Charges outside the closed surface contribute zero net flux.',
      },
      {
        _id: 'gl-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'For Gauss’s Law to be used effectively as an analytical tool to calculate D directly from ∮ D · dS = D ∮ dS = D S, which condition must the chosen Gaussian surface satisfy?',
        options: [
          'D must be everywhere normal (or tangential) to the surface with uniform magnitude over the normal parts.',
          'The Gaussian surface must be a physical conducting boundary.',
          'The total charge enclosed must always be zero.',
          'D must have non-zero curl everywhere on the surface.',
        ],
        correctAnswer:
          'D must be everywhere normal (or tangential) to the surface with uniform magnitude over the normal parts.',
        explanation:
          'To factor |D| out of the surface integral, D must be either strictly tangential (D · dS = 0) or strictly normal with constant magnitude over each face of the Gaussian surface.',
      },
      {
        _id: 'gl-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Using a spherical Gaussian surface of radius r = 0.50 m centered on an isolated point charge Q = +4.0 nC in free space, what is the magnitude of the electric flux density D?',
        options: ['1.27 nC/m²', '5.09 nC/m²', '0.32 nC/m²', '16.00 nC/m²'],
        correctAnswer: '1.27 nC/m²',
        explanation:
          'By spherical symmetry, ∮ D · dS = D(4π r²) = Q => D = Q / (4π r²) = (4.0 × 10⁻⁹ C) / (4π * 0.25 m²) = (4.0 × 10⁻⁹) / π ≈ 1.273 nC/m².',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'gl-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An infinite line charge with uniform density ρ_L = +30 nC/m lies along the z-axis. A cylindrical Gaussian surface of radius ρ = 2.0 m and length L = 5.0 m is coaxial with the line. What is the electric flux density D_ρ at the cylindrical surface?',
        options: ['2.39 nC/m²', '4.77 nC/m²', '1.20 nC/m²', '7.50 nC/m²'],
        correctAnswer: '2.39 nC/m²',
        explanation:
          'By cylindrical symmetry, flux passes only through the curved side: D_ρ (2π ρ L) = ρ_L L => D_ρ = ρ_L / (2π ρ) = (30 × 10⁻⁹) / (2π * 2.0) ≈ 2.387 nC/m² ≈ 2.39 nC/m².',
      },
      {
        _id: 'gl-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An infinite planar sheet at z = 0 carries a uniform surface charge density ρ_s = +40 nC/m². What is the electric field intensity E in the region z > 0? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '+2.26â_z kV/m (+2259â_z V/m)',
          '+4.52â_z kV/m',
          '+1.13â_z kV/m',
          '+9.04â_z kV/m',
        ],
        correctAnswer: '+2.26â_z kV/m (+2259â_z V/m)',
        explanation:
          'Using a pillbox Gaussian surface spanning the sheet: 2 D_z A = ρ_s A => D_z = ρ_s / 2. Then E = (ρ_s / 2ε₀) â_z = (40 × 10⁻⁹ / (2 * 8.854 × 10⁻¹²)) â_z ≈ 2258.9â_z V/m ≈ 2.26â_z kV/m.',
      },
      {
        _id: 'gl-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'If the electric flux density in a region is D = (3x²â_x + 2yâ_y + 4zâ_z) C/m², evaluate the total electric flux Ψ exiting the closed cube defined by 0 ≤ x ≤ 2, 0 ≤ y ≤ 2, 0 ≤ z ≤ 2 (in meters).',
        options: ['96 C', '48 C', '192 C', '24 C'],
        correctAnswer: '96 C',
        explanation:
          'By Divergence Theorem: ∇ · D = ∂(3x²)/∂x + ∂(2y)/∂y + ∂(4z)/∂z = 6x + 2 + 4 = 6x + 6. Ψ = ∫₀² ∫₀² ∫₀² (6x + 6) dx dy dz = 4 ∫₀² (6x+6) dx = 4 [3x² + 6x]₀² = 4 [12 + 12] = 96 C.',
      },
      {
        _id: 'gl-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A single point charge Q = +24 nC is placed at one vertex (corner) of a closed cubic box of side length a = 1.0 m. What is the total electric flux Ψ passing through any ONE of the three faces that do NOT meet at that vertex?',
        options: ['1.0 nC', '3.0 nC', '4.0 nC', '0.5 nC'],
        correctAnswer: '1.0 nC',
        explanation:
          'By symmetry, placing 8 identical cubes around the corner vertex encloses charge Q completely, so total flux through one entire cube is Q/8 = 3.0 nC. The 3 faces meeting at that vertex experience zero flux because E lies entirely in the plane of those faces (E is tangential to the face, i.e., E ⊥ dS, so E · dS = 0). The remaining 3 opposite faces share the 3.0 nC equally: Ψ_face = (Q/8) / 3 = Q / 24 = 24 nC / 24 = 1.0 nC.',
      },
      {
        _id: 'gl-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A solid dielectric sphere of radius R = 0.20 m carries a uniform volume charge density ρ_v = +50 μC/m³. What is the electric flux density D_r at an internal radial distance r = 0.12 m?',
        options: ['2.00 μC/m²', '3.33 μC/m²', '1.20 μC/m²', '5.00 μC/m²'],
        correctAnswer: '2.00 μC/m²',
        explanation:
          'Inside the sphere (r < R): D_r (4π r²) = ρ_v (4/3 π r³) => D_r = (ρ_v r) / 3 = (50 × 10⁻⁶ * 0.12) / 3 = 2.00 μC/m².',
      },
      {
        _id: 'gl-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Two infinite parallel planes located at x = -2 m and x = +2 m carry uniform surface charge densities ρ_s1 = +60 nC/m² and ρ_s2 = -60 nC/m², respectively. What is the electric field E in the region between the sheets (-2 < x < +2)? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '+6.78â_x kV/m (+6777â_x V/m)',
          '0 V/m',
          '+3.39â_x kV/m',
          '-6.78â_x kV/m',
        ],
        correctAnswer: '+6.78â_x kV/m (+6777â_x V/m)',
        explanation:
          'Between the plates, fields from both sheets point in the +â_x direction and add constructively: E = (ρ_s / 2ε₀ + ρ_s / 2ε₀) â_x = (ρ_s / ε₀) â_x = (60 × 10⁻⁹ / 8.854 × 10⁻¹²) â_x ≈ 6.78â_x kV/m.',
      },
      {
        _id: 'gl-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'In spherical coordinates, the electric flux density is given by D = (10 / r²) â_r C/m² for r > 0. What is the volume charge density ρ_v in this region?',
        options: ['0 C/m³', '10/r³ C/m³', '20/r³ C/m³', '-10/r² C/m³'],
        correctAnswer: '0 C/m³',
        explanation:
          'ρ_v = ∇ · D = (1/r²) ∂(r² D_r)/∂r = (1/r²) ∂(r² * 10/r²)/∂r = (1/r²) ∂(10)/∂r = 0 C/m³.',
      },
      {
        _id: 'gl-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A coaxial cable has an inner solid conductor of radius a = 2.0 mm carrying line charge ρ_L = +80 nC/m, and an outer cylindrical conducting shell of inner radius b = 6.0 mm carrying -ρ_L = -80 nC/m. Using Gauss’s Law, what is the electric flux density D_ρ at radial distance ρ = 4.0 mm (between the conductors)?',
        options: ['3.18 μC/m²', '6.37 μC/m²', '1.59 μC/m²', '0 μC/m²'],
        correctAnswer: '3.18 μC/m²',
        explanation:
          'Enclosing a length L of the inner cylinder: D_ρ (2π ρ L) = ρ_L L => D_ρ = ρ_L / (2π ρ) = (80 × 10⁻⁹) / (2π * 0.004) = (2 × 10⁻⁵) / (2π) ≈ 3.183 μC/m².',
      },
      {
        _id: 'gl-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A solid conducting sphere of radius a = 5 cm carries charge Q₁ = +12 nC. It is surrounded by a concentric thin spherical conducting shell of radius b = 10 cm carrying charge Q₂ = -4 nC. What is the total electric flux Ψ passing through a spherical Gaussian surface of radius r = 15 cm?',
        options: ['+8.0 nC', '+12.0 nC', '+16.0 nC', '-4.0 nC'],
        correctAnswer: '+8.0 nC',
        explanation:
          'Since the Gaussian surface of radius r = 15 cm encloses both the inner sphere and the outer shell, Q_enc = Q₁ + Q₂ = +12 nC + (-4 nC) = +8.0 nC. By Gauss’s Law, Ψ = Q_enc = +8.0 nC.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'gl-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A sphere of radius R = 2.0 m contains volume charge density ρ_v(r) = ρ₀ (1 - r/R), where ρ₀ = 120 nC/m³. At what radial distance r_m inside the sphere does the electric field intensity E_r attain its maximum value?',
        options: [
          'r = (2/3) R ≈ 1.33 m',
          'r = (1/2) R = 1.00 m',
          'r = (3/4) R = 1.50 m',
          'r = R = 2.00 m',
        ],
        correctAnswer: 'r = (2/3) R ≈ 1.33 m',
        explanation:
          'Q(r) = 4π ρ₀ ∫₀^r (r’² - r’³/R) dr’ = 4π ρ₀ [r³/3 - r⁴/(4R)]. Then D_r = Q(r) / (4π r²) = ρ₀ [r/3 - r²/(4R)]. Maximizing D_r by setting dD_r/dr = 0 => 1/3 - 2r/(4R) = 0 => r = (2/3) R = 4/3 m ≈ 1.33 m.',
      },
      {
        _id: 'gl-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A solid dielectric sphere of radius R has uniform volume charge density ρ_v. An off-center spherical cavity of radius a < R is hollowed out, centered at displacement vector d from the center of the sphere (|d| + a < R). Using Gauss’s Law and superposition, what is the electric field E inside the cavity?',
        options: [
          'Uniform: E = (ρ_v d) / (3ε₀), pointing in the direction of the offset vector d',
          'Zero: E = 0 everywhere inside the cavity',
          'Radial: E = (ρ_v r) / (3ε₀), pointing radially from the main sphere center',
          'Inverse square: E = (ρ_v d²) / (3ε₀ r²) â_r',
        ],
        correctAnswer:
          'Uniform: E = (ρ_v d) / (3ε₀), pointing in the direction of the offset vector d',
        explanation:
          'By superposition: E = E_solid - E_cavity = (ρ_v r) / (3ε₀) - (ρ_v (r - d)) / (3ε₀) = (ρ_v d) / (3ε₀), which is perfectly constant and uniform everywhere inside the cavity.',
      },
      {
        _id: 'gl-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'An infinitely long cylinder of radius b = 0.50 m centered on the z-axis contains volume charge density ρ_v(ρ) = k₀ ρ² C/m³, where k₀ = 40 μC/m⁵. What is the electric flux density D_ρ at an external observation point ρ = 1.0 m?',
        options: [
          '625 nC/m² (0.625 μC/m²)',
          '1250 nC/m²',
          '312.5 nC/m²',
          '2500 nC/m²',
        ],
        correctAnswer: '625 nC/m² (0.625 μC/m²)',
        explanation:
          'Enclosed charge per unit length: Q_enc / L = ∫₀^b (k₀ ρ²)(2π ρ) dρ = 2π k₀ [b⁴/4] = π(40 × 10⁻⁶)(0.5⁴) / 2 = 1.25π μC/m. For ρ = 1.0 m: D_ρ (2π ρ) = Q_enc / L => D_ρ = (1.25π × 10⁻⁶) / (2π * 1.0) = 0.625 μC/m² = 625 nC/m².',
      },
      {
        _id: 'gl-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'At the planar interface z = 0 between two dielectric media (Region 1: z > 0, ε_r1 = 2.0; Region 2: z < 0, ε_r2 = 6.0), there exists a free surface charge density ρ_s = +15.0 nC/m². If the electric field in Region 1 is E₁ = (50â_x - 100â_y + 200â_z) V/m, what is the normal component of electric flux density D_2n in Region 2 just below the boundary? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '-11.46 nC/m²',
          '+18.54 nC/m²',
          '+3.54 nC/m²',
          '-15.00 nC/m²',
        ],
        correctAnswer: '-11.46 nC/m²',
        explanation:
          'By Gauss’s pillbox boundary condition: D_1n - D_2n = ρ_s => D_2n = D_1n - ρ_s. Here D_1n = ε_r1 ε₀ E_1z = 2.0 * (8.854 × 10⁻¹²) * 200 = 3.5416 nC/m². Thus D_2n = 3.5416 - 15.0 = -11.458 nC/m² ≈ -11.46 nC/m².',
      },
      {
        _id: 'gl-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A coaxial cylinder of inner radius a = 1.0 cm carries line charge ρ_L = +62.83 nC/m (20π nC/m). The annular region 1.0 cm ≤ ρ ≤ 2.0 cm is filled with dielectric ε_r1 = 4.0, and 2.0 cm ≤ ρ ≤ 4.0 cm is filled with dielectric ε_r2 = 2.0. What is the electric field intensity E_ρ at ρ = 3.0 cm (in Layer 2)? (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '18.82 kV/m',
          '9.41 kV/m',
          '37.64 kV/m',
          '4.71 kV/m',
        ],
        correctAnswer: '18.82 kV/m',
        explanation:
          'By Gauss’s Law, D_ρ = ρ_L / (2π ρ) in any concentric dielectric layer. At ρ = 0.03 m: D_ρ = (62.83 × 10⁻⁹) / (2π * 0.03) = 333.3 nC/m². In layer 2 (ε_r2 = 2.0): E_ρ = D_ρ / (ε_r2 ε₀) = (3.333 × 10⁻⁷) / (2 * 8.854 × 10⁻¹²) ≈ 18822 V/m ≈ 18.82 kV/m.',
      },
      {
        _id: 'gl-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A hollow thick spherical shell has inner radius a = 1.0 m and outer radius b = 3.0 m. The shell carries volume charge density ρ_v(r) = (ρ₀ a²) / r² for a ≤ r ≤ b, where ρ₀ = 90 nC/m³. A point charge Q₀ = +180π nC ≈ +565.49 nC is placed at the center (r = 0). What is the electric flux density D_r at the outer surface r = b = 3.0 m?',
        options: ['25.0 nC/m²', '50.0 nC/m²', '12.5 nC/m²', '75.0 nC/m²'],
        correctAnswer: '25.0 nC/m²',
        explanation:
          'Shell charge Q_shell = ∫_a^b ((ρ₀ a²) / r²) 4π r² dr = 4π ρ₀ a² (b - a) = 4π (90 × 10⁻⁹)(1.0)(2.0) = 720π nC. Total enclosed charge Q_enc = Q₀ + Q_shell = 180π + 720π = 900π nC. At r = 3.0 m: D_r = Q_enc / (4π b²) = (900π × 10⁻⁹) / (4π * 9.0) = 25.0 nC/m².',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // CHAPTER 6: FIELD OPERATIONS / GRADIENT (20 Total)
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  // ══════════════════════════════════════════════════════════════
  gradient: {
    module: 'electrostatics',
    chapter: 'gradient',
    title: 'Field Operations',
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'grad-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What does the gradient of a scalar field V, denoted ∇V, physically represent at any point in space?',
        options: [
          'A vector whose magnitude is the maximum spatial rate of increase of V, pointing in the direction of that maximum increase.',
          'A scalar indicating the total flux per unit volume exiting that point.',
          'A vector pointing in the direction of zero change of V, along the equipotential surface.',
          'A vector measuring the circulation and curl of the scalar field.',
        ],
        correctAnswer:
          'A vector whose magnitude is the maximum spatial rate of increase of V, pointing in the direction of that maximum increase.',
        explanation:
          'By definition, ∇V is a vector field that points in the direction of the greatest spatial rate of increase of scalar field V, with magnitude equal to that maximum rate of increase.',
      },
      {
        _id: 'grad-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'In electrostatics, what fundamental vector relationship connects the electric field intensity E to the electrostatic scalar potential V?',
        options: [
          'E = -∇V',
          'E = +∇V',
          'E = ∇ × (∇V)',
          'E = -∇²V',
        ],
        correctAnswer: 'E = -∇V',
        explanation:
          'The electric field is the negative gradient of the potential (E = -∇V), meaning E points in the direction of steepest potential decrease and is perpendicular to equipotential surfaces.',
      },
      {
        _id: 'grad-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the physical interpretation of the divergence of a vector field, ∇ · A, at a given point?',
        options: [
          'The net outward flux of A per unit volume exiting an infinitesimal volume around that point.',
          'The net line integral and circulation of A around an infinitesimal loop.',
          'The maximum directional derivative of A along the surface normal.',
          'The curl of the vector potential.',
        ],
        correctAnswer:
          'The net outward flux of A per unit volume exiting an infinitesimal volume around that point.',
        explanation:
          '∇ · A = lim(ΔV→0) [∮ A · dS / ΔV], representing the net outward flux per unit volume (source density if positive, sink density if negative).',
      },
      {
        _id: 'grad-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the curl of any electrostatic field (∇ × E), and what does this imply about the electrostatic field?',
        options: [
          '∇ × E = 0, meaning the electrostatic field is conservative (irrotational) and its line integral around any closed path is zero.',
          '∇ × E = ρ_v / ε₀, meaning the field generates rotational vortex lines.',
          '∇ × E = -∂B/∂t ≠ 0 even in static conditions.',
          '∇ × E = ∇ · E.',
        ],
        correctAnswer:
          '∇ × E = 0, meaning the electrostatic field is conservative (irrotational) and its line integral around any closed path is zero.',
        explanation:
          'In electrostatics, ∮ E · dl = 0 <=> ∇ × E = 0. This confirms the field is conservative and derivable from a scalar potential E = -∇V (since ∇ × (∇V) ≡ 0).',
      },
      {
        _id: 'grad-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'How is the Laplacian of a scalar field V, written as ∇²V, mathematically defined in terms of first-order vector operators?',
        options: [
          'The divergence of the gradient: ∇²V = ∇ · (∇V)',
          'The curl of the gradient: ∇²V = ∇ × (∇V)',
          'The gradient of the divergence: ∇²V = ∇ (∇ · V)',
          'The dot product of two gradients: ∇²V = (∇V) · (∇V)',
        ],
        correctAnswer: 'The divergence of the gradient: ∇²V = ∇ · (∇V)',
        explanation:
          'The Laplacian of a scalar field is defined as ∇²V = ∇ · (∇V), resulting in the second-order partial derivative sum ∂²V/∂x² + ∂²V/∂y² + ∂²V/∂z² in Cartesian coordinates.',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'grad-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Given the electrostatic potential V(x, y, z) = 3x²y - y z² + 4z (V), find the electric field intensity vector E at the point P(2, -1, 3).',
        options: [
          '(12â_x - 3â_y - 10â_z) V/m',
          '(-12â_x + 3â_y + 10â_z) V/m',
          '(12â_x + 3â_y - 10â_z) V/m',
          '(6â_x - 3â_y + 10â_z) V/m',
        ],
        correctAnswer: '(12â_x - 3â_y - 10â_z) V/m',
        explanation:
          'E = -∇V = -[(6xy)â_x + (3x² - z²)â_y + (-2yz + 4)â_z]. At (2, -1, 3): E = -[-12â_x + (12 - 9)â_y + (6 + 4)â_z] = (12â_x - 3â_y - 10â_z) V/m.',
      },
      {
        _id: 'grad-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'In cylindrical coordinates, the potential is V(ρ, φ, z) = 10 ρ sinφ - 2 z² V. What is the electric field E at the point (ρ = 4 m, φ = 30°, z = 2 m)?',
        options: [
          '(-5.00â_ρ - 8.66â_φ + 8.00â_z) V/m',
          '(5.00â_ρ + 8.66â_φ - 8.00â_z) V/m',
          '(-5.00â_ρ - 2.17â_φ + 8.00â_z) V/m',
          '(-10.00â_ρ - 8.66â_φ + 4.00â_z) V/m',
        ],
        correctAnswer: '(-5.00â_ρ - 8.66â_φ + 8.00â_z) V/m',
        explanation:
          'E = -[∂V/∂ρ â_ρ + (1/ρ)∂V/∂φ â_φ + ∂V/∂z â_z] = -[10sin(30°)â_ρ + 10cos(30°)â_φ - 8â_z] = (-5â_ρ - 8.66â_φ + 8â_z) V/m.',
      },
      {
        _id: 'grad-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'For the vector flux density D = (4x y²â_x + 2x² yâ_y - 3z²â_z) C/m², calculate the divergence ∇ · D at point P(1, 2, 3).',
        options: ['0 C/m³', '18 C/m³', '-18 C/m³', '36 C/m³'],
        correctAnswer: '0 C/m³',
        explanation:
          '∇ · D = ∂(4xy²)/∂x + ∂(2x²y)/∂y + ∂(-3z²)/∂z = 4y² + 2x² - 6z. At (1, 2, 3): 4(4) + 2(1) - 6(3) = 16 + 2 - 18 = 0 C/m³.',
      },
      {
        _id: 'grad-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A vector field in cylindrical coordinates is given by A = (ρ²â_ρ + ρ sinφ â_φ + 3z â_z). What is ∇ · A at the point (ρ = 2 m, φ = 0°, z = 5 m)?',
        options: ['10.0', '7.0', '13.0', '5.0'],
        correctAnswer: '10.0',
        explanation:
          '∇ · A = (1/ρ)∂(ρ³)/∂ρ + (1/ρ)∂(ρ sinφ)/∂φ + ∂(3z)/∂z = 3ρ + cosφ + 3 = 3(2) + 1 + 3 = 10.0.',
      },
      {
        _id: 'grad-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Determine the curl of the vector field F = (y² z â_x + 2x y z â_y + x y² â_z).',
        options: [
          '0 (The field is irrotational / conservative)',
          '(2xyâ_x + y²â_y + 2yzâ_z)',
          '(-2xyâ_x + y²â_y)',
          '4xyz â_z',
        ],
        correctAnswer: '0 (The field is irrotational / conservative)',
        explanation:
          'Evaluating the curl determinant gives all three components identically equal to zero: ∇ × F = â_x(2xy - 2xy) - â_y(y² - y²) + â_z(2yz - 2yz) = 0.',
      },
      {
        _id: 'grad-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Given the potential function V(x, y, z) = 5 x³ - 3 x y² + 2 z² V, calculate the Laplacian ∇²V at the point P(2, 1, -1).',
        options: ['52 V/m²', '64 V/m²', '28 V/m²', '0 V/m²'],
        correctAnswer: '52 V/m²',
        explanation:
          '∇²V = ∂²V/∂x² + ∂²V/∂y² + ∂²V/∂z² = 30x - 6x + 4 = 24x + 4. At x=2: 24(2) + 4 = 52 V/m².',
      },
      {
        _id: 'grad-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'What is the unit normal vector â_n to the equipotential surface f(x, y, z) = x² + y² - z = 4 at the point P(2, 1, 1) directed toward increasing f?',
        options: [
          '(4â_x + 2â_y - â_z) / √21',
          '(2â_x + â_y - â_z) / √6',
          '(4â_x + 2â_y + â_z) / √21',
          '(â_x + â_y - â_z) / √3',
        ],
        correctAnswer: '(4â_x + 2â_y - â_z) / √21',
        explanation:
          'The unit normal to any level surface f(x,y,z)=c is given by â_n = ∇f / |∇f| = (4â_x + 2â_y - â_z) / √(4² + 2² + (-1)²) = (4â_x + 2â_y - â_z) / √21.',
      },
      {
        _id: 'grad-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A vector field is defined as B(x, y, z). Under what mathematical conditions is B classified as (i) solenoidal and (ii) irrotational?',
        options: [
          '(i) Solenoidal when ∇ · B = 0; (ii) Irrotational when ∇ × B = 0',
          '(i) Solenoidal when ∇ × B = 0; (ii) Irrotational when ∇ · B = 0',
          '(i) Solenoidal when ∇² B = 0; (ii) Irrotational when ∇ · B = 0',
          '(i) Solenoidal when ∮ B · dl ≠ 0; (ii) Irrotational when ∮ B · dS = 0',
        ],
        correctAnswer:
          '(i) Solenoidal when ∇ · B = 0; (ii) Irrotational when ∇ × B = 0',
        explanation:
          'A vector field with zero divergence (∇ · B = 0) has no point sources/sinks and is called solenoidal. A vector field with zero curl (∇ × B = 0) has no vortex circulation and is called irrotational (conservative).',
      },
      {
        _id: 'grad-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Which of the following electrostatic potential functions satisfies Laplace’s equation ∇²V = 0 in free space?',
        options: [
          'V(x, y, z) = x² - y² + 4z',
          'V(x, y, z) = x² + y² + z²',
          'V(x, y, z) = x³ - y³',
          'V(x, y, z) = x² y + z',
        ],
        correctAnswer: 'V(x, y, z) = x² - y² + 4z',
        explanation:
          'For V = x² - y² + 4z: ∂²V/∂x² = 2, ∂²V/∂y² = -2, ∂²V/∂z² = 0 => ∇²V = 2 + (-2) + 0 = 0.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'grad-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'In spherical coordinates, the potential of a point dipole is V(r, θ) = (p cosθ) / (4πε₀ r²). Using E = -∇V, what is the analytical expression for the electric field E(r, θ)?',
        options: [
          'E = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ)',
          'E = [p / (4πε₀ r³)] (cosθ â_r - 2sinθ â_θ)',
          'E = [p / (4πε₀ r²)] (2cosθ â_r + sinθ â_θ)',
          'E = [p / (4πε₀ r⁴)] (cosθ â_r + 2sinθ â_θ)',
        ],
        correctAnswer: 'E = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ)',
        explanation:
          'Using E = -[∂V/∂r â_r + (1/r)∂V/∂θ â_θ] = -[-2p cosθ / (4πε₀ r³) â_r - p sinθ / (4πε₀ r³) â_θ] = [p / (4πε₀ r³)] (2cosθ â_r + sinθ â_θ).',
      },
      {
        _id: 'grad-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'For a radial field in spherical coordinates A = (k / rⁿ) â_r (r > 0, where k is a constant), for what value of the power n is the divergence ∇ · A = 0 everywhere for r > 0?',
        options: ['n = 2 (Inverse-square law)', 'n = 1', 'n = 3', 'n = 0'],
        correctAnswer: 'n = 2 (Inverse-square law)',
        explanation:
          '∇ · A = (1/r²) d/dr [r² · k r^(-n)] = [k(2-n)] / r^(n+1). This vanishes identically for r>0 if and only if n = 2, which is the physical reason Coulomb’s inverse-square field has zero divergence in charge-free space.',
      },
      {
        _id: 'grad-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Given the vector field F = (2yâ_x + 3xâ_y) in the xy-plane, evaluate the circulation ∮_C F · dl around the perimeter of the rectangle 0 ≤ x ≤ 3, 0 ≤ y ≤ 2 in the counter-clockwise direction using Stokes’ Theorem.',
        options: ['6.0', '12.0', '0.0', '1.0'],
        correctAnswer: '6.0',
        explanation:
          '∇ × F = [∂(3x)/∂x - ∂(2y)/∂y] â_z = (3 - 2)â_z = 1â_z. By Stokes’ Theorem, ∮_C F · dl = ∬ (∇ × F) · dS = 1 * (Area) = 1 * (3 * 2) = 6.0.',
      },
      {
        _id: 'grad-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Which of the following statements represents the two fundamental null vector identities that hold true for any twice-differentiable scalar field V and vector field A?',
        options: [
          '∇ × (∇V) ≡ 0 (Curl of gradient is zero) and ∇ · (∇ × A) ≡ 0 (Divergence of curl is zero)',
          '∇ · (∇V) ≡ 0 and ∇ × (∇ × A) ≡ 0',
          '∇ × (∇ · A) ≡ 0 and ∇ (∇ × A) ≡ 0',
          '∇² (∇V) ≡ 0 and ∇ · (∇ · A) ≡ 0',
        ],
        correctAnswer:
          '∇ × (∇V) ≡ 0 (Curl of gradient is zero) and ∇ · (∇ × A) ≡ 0 (Divergence of curl is zero)',
        explanation:
          'The two universal null identities in vector calculus are: (1) The curl of any gradient is identically zero (∇ × ∇V = 0), guaranteeing potential fields are conservative; (2) The divergence of any curl is identically zero (∇ · (∇ × A) = 0), guaranteeing magnetic fields B = ∇ × A have no monopoles.',
      },
      {
        _id: 'grad-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'In a region of space with permittivity ε = 2ε₀, the electrostatic potential is V(x, y, z) = (40 x² y - 10 z³) V. Using Poisson’s equation ∇²V = -ρ_v / ε, find the volume charge density ρ_v at point P(1 m, 2 m, -1 m). (ε₀ = 8.854 × 10⁻¹² F/m)',
        options: [
          '-3.90 nC/m³ (-3.896 × 10⁻⁹ C/m³)',
          '+3.90 nC/m³',
          '-1.95 nC/m³',
          '-7.79 nC/m³',
        ],
        correctAnswer: '-3.90 nC/m³ (-3.896 × 10⁻⁹ C/m³)',
        explanation:
          '∇²V = 80y - 60z. At (1, 2, -1): ∇²V = 80(2) - 60(-1) = 220 V/m². From Poisson’s equation: ρ_v = -2ε₀ ∇²V = -2(8.854 × 10⁻¹²)(220) = -3.896 nC/m³.',
      },
      {
        _id: 'grad-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'In cylindrical coordinates, the potential distribution between two coaxial cylinders is V(ρ) = C₁ lnρ + C₂ where C₁ = 50 V and C₂ = 100 V. Evaluate the Laplacian ∇²V for any ρ > 0 and state what this indicates about the volume charge density ρ_v between the cylinders.',
        options: [
          '∇²V = 0, indicating a charge-free dielectric region (ρ_v = 0) satisfying Laplace’s equation',
          '∇²V = 50/ρ², indicating uniform charge distribution',
          '∇²V = -50/ρ, indicating non-zero space charge',
          '∇²V = 100 lnρ',
        ],
        correctAnswer:
          '∇²V = 0, indicating a charge-free dielectric region (ρ_v = 0) satisfying Laplace’s equation',
        explanation:
          '∇²V = (1/ρ) d/dρ [ρ d/dρ(50 lnρ + 100)] = (1/ρ) d/dρ(50) = 0. This confirms the inter-conductor dielectric space contains no net free volume charge (ρ_v = 0).',
      },
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// TRANSMISSION LINES MODULE
// ══════════════════════════════════════════════════════════════
export const transmissionLinesQuizzes: Record<string, ChapterQuizData> = {};

// ══════════════════════════════════════════════════════════════
// MAXWELL EQUATIONS MODULE
// ══════════════════════════════════════════════════════════════
export const maxwellEquationsQuizzes: Record<string, ChapterQuizData> = {
  // ── CHAPTER: GAUSS'S LAW FOR MAGNETISM (20 Total) ──
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  'gauss-law-magnetism': {
    module: 'maxwell-equations',
    chapter: 'gauss-law-magnetism',
    title: "Gauss's Law for Magnetism",
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'glm-easy-1',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What is the fundamental physical principle expressed by Gauss’s Law for Magnetism (∮_S B · dS = 0 or ∇ · B = 0)?',
        options: [
          'Magnetic monopoles (isolated magnetic charges) do not exist in nature, and magnetic field lines form continuous closed loops.',
          'Magnetic fields exert zero force on moving electric charges.',
          'The magnetic field is always conservative and irrotational (∇ × B = 0).',
          'Magnetic flux is proportional to the total electric charge enclosed.',
        ],
        correctAnswer:
          'Magnetic monopoles (isolated magnetic charges) do not exist in nature, and magnetic field lines form continuous closed loops.',
        explanation:
          'Gauss’s Law for Magnetism states that the net magnetic flux through any closed surface is always zero, meaning isolated magnetic poles (monopoles) do not exist and magnetic flux lines always close on themselves.',
      },
      {
        _id: 'glm-easy-2',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Which mathematical equation correctly represents the integral form of Gauss’s Law for Magnetism over any closed surface S?',
        options: [
          '∮_S B · dS = 0',
          '∮_S B · dl = μ₀ I_enc',
          '∮_S B · dS = μ₀ Q_m',
          '∮_S B × dS = 0',
        ],
        correctAnswer: '∮_S B · dS = 0',
        explanation:
          'The total outward magnetic flux Φ = ∮_S B · dS = 0 across any closed surface S.',
      },
      {
        _id: 'glm-easy-3',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'What are the standard SI units for magnetic flux density (B) and total magnetic flux (Φ), respectively?',
        options: [
          'Tesla (T or Wb/m²) and Weber (Wb or T·m²)',
          'Weber (Wb) and Tesla (T)',
          'Ampere per meter (A/m) and Henry (H)',
          'Coulomb (C) and Volt (V)',
        ],
        correctAnswer: 'Tesla (T or Wb/m²) and Weber (Wb or T·m²)',
        explanation:
          'B is measured in Tesla (T = Wb/m² = N/(A·m)), and magnetic flux Φ = ∫ B · dS is measured in Webers (Wb = T·m² = V·s).',
      },
      {
        _id: 'glm-easy-4',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'Because ∇ · B = 0 everywhere, the magnetic field can always be defined mathematically in terms of a magnetic vector potential A as:',
        options: [
          'B = ∇ × A',
          'B = -∇ A',
          'B = ∇ · A',
          'B = ∇² A',
        ],
        correctAnswer: 'B = ∇ × A',
        explanation:
          'Since the divergence of any curl is identically zero (∇ · (∇ × A) ≡ 0), Gauss’s Law for Magnetism (∇ · B = 0) guarantees that B can always be written as the curl of a magnetic vector potential A.',
      },
      {
        _id: 'glm-easy-5',
        type: 'MCQ',
        difficulty: 'EASY',
        points: 1,
        timeLimitSeconds: 120,
        question:
          'If a permanent bar magnet with North (N) and South (S) poles is cut in half along its transverse midline, what is the resulting physical state according to Gauss’s Law for Magnetism?',
        options: [
          'Two complete smaller magnets are formed, each having its own North and South pole.',
          'One piece becomes an isolated North monopole, and the other becomes an isolated South monopole.',
          'Both pieces lose their magnetization completely.',
          'The magnetic field inside both pieces collapses to zero.',
        ],
        correctAnswer:
          'Two complete smaller magnets are formed, each having its own North and South pole.',
        explanation:
          'Because magnetic field lines are continuous closed loops and magnetic monopoles cannot exist (∇ · B = 0), breaking a magnet creates new opposite poles at the break, producing two complete dipole magnets.',
      },

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'glm-med-1',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A uniform magnetic field B = (0.40â_x - 0.30â_y + 0.50â_z) T passes through a flat rectangular surface of dimensions 0.20 m × 0.30 m lying in the xy-plane (z = 0) with normal â_n = +â_z. What is the total magnetic flux Φ penetrating the surface?',
        options: ['30 mWb (0.030 Wb)', '60 mWb', '15 mWb', '42.4 mWb'],
        correctAnswer: '30 mWb (0.030 Wb)',
        explanation:
          'Φ = ∫ B · dS = B_z * A = 0.50 T * (0.20 m * 0.30 m) = 0.030 Wb = 30 mWb.',
      },
      {
        _id: 'glm-med-2',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'Which of the following mathematical expressions represents a physically valid magnetic field B that satisfies Gauss’s Law for Magnetism (∇ · B = 0) everywhere?',
        options: [
          'B = (2x yâ_x - y²â_y + 3â_z) T',
          'B = (3xâ_x + 2yâ_y + zâ_z) T',
          'B = (x²â_x + y²â_y + z²â_z) T',
          'B = (x yâ_x + y zâ_y + x zâ_z) T',
        ],
        correctAnswer: 'B = (2x yâ_x - y²â_y + 3â_z) T',
        explanation:
          '∇ · B = ∂(2xy)/∂x + ∂(-y²)/∂y + ∂(3)/∂z = 2y - 2y + 0 = 0. The divergence is identically zero, satisfying Gauss’s law for magnetism.',
      },
      {
        _id: 'glm-med-3',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'At the boundary between medium 1 (μ_r1 = 2.0) and medium 2 (μ_r2 = 8.0), the normal component of magnetic flux density in medium 1 is B_1n = 0.40 T. According to Gauss’s Law for Magnetism, what is the normal component B_2n in medium 2?',
        options: [
          'B_2n = 0.40 T (Normal B is strictly continuous: B_1n = B_2n)',
          'B_2n = 1.60 T',
          'B_2n = 0.10 T',
          'B_2n = 0 T',
        ],
        correctAnswer:
          'B_2n = 0.40 T (Normal B is strictly continuous: B_1n = B_2n)',
        explanation:
          'Applying a pillbox Gaussian surface across any interface gives ∮ B · dS = (B_1n - B_2n) ΔS = 0 => B_1n = B_2n. The normal component of B is always continuous across any interface.',
      },
      {
        _id: 'glm-med-4',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A closed cubic box with side length s = 0.50 m is placed in a non-uniform magnetic field. Measurements show that the outward magnetic flux through five of its faces are +12 mWb, -8 mWb, +15 mWb, -4 mWb, and +7 mWb. What is the magnetic flux Φ₆ through the sixth face?',
        options: ['-22 mWb', '+22 mWb', '-46 mWb', '0 mWb'],
        correctAnswer: '-22 mWb',
        explanation:
          'By Gauss’s Law for Magnetism, ∮_cube B · dS = ∑ Φ_i = 0 => Φ₆ = -(12 - 8 + 15 - 4 + 7) mWb = -22 mWb.',
      },
      {
        _id: 'glm-med-5',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'The magnetic vector potential along the circular rim of a disk of radius R = 0.30 m is A = (5.0â_φ) Wb/m. Using Stokes’ Theorem Φ = ∮_C A · dl, what is the total magnetic flux Φ passing through the disk?',
        options: [
          '9.42 Wb (3.0π Wb)',
          '4.71 Wb (1.5π Wb)',
          '1.41 Wb',
          '18.85 Wb',
        ],
        correctAnswer: '9.42 Wb (3.0π Wb)',
        explanation:
          'By Stokes’ Theorem: Φ = ∫_S B · dS = ∫_S (∇ × A) · dS = ∮_C A · dl = A_φ (2π R) = 5.0 * 2π(0.30) = 3π Wb ≈ 9.42 Wb.',
      },
      {
        _id: 'glm-med-6',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'An ideal long air-core solenoid with n = 1000 turns/m and cross-sectional radius r = 2.0 cm carries a steady current I = 4.0 A. What is the total magnetic flux Φ passing through its cross-sectional area? (μ₀ = 4π × 10⁻⁷ H/m)',
        options: ['6.32 μWb', '5.03 μWb', '12.63 μWb', '2.51 μWb'],
        correctAnswer: '6.32 μWb',
        explanation:
          'B = μ₀ n I = (4π × 10⁻⁷)(1000)(4) = 5.027 mT. Φ = B * (π r²) = (5.027 × 10⁻³)(π * 0.02²) = 6.32 μWb.',
      },
      {
        _id: 'glm-med-7',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'The magnetic field of an infinite filamentary wire along the z-axis carrying current I is B = [μ₀ I / (2π ρ)] â_φ. Verify Gauss’s Law for Magnetism by computing ∇ · B in cylindrical coordinates for ρ > 0.',
        options: [
          '∇ · B = 0, confirming B has closed circular field lines with zero divergence',
          '∇ · B = μ₀ I / (2π ρ²)',
          '∇ · B = μ₀ I / ρ',
          '∇ · B = ∞',
        ],
        correctAnswer:
          '∇ · B = 0, confirming B has closed circular field lines with zero divergence',
        explanation:
          'In cylindrical coordinates, B_ρ = 0, B_z = 0, and B_φ does not depend on φ. Therefore, ∇ · B = (1/ρ) ∂B_φ/∂φ = 0, identically satisfying ∇ · B = 0.',
      },
      {
        _id: 'glm-med-8',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'A flat circular disk of radius R = 0.50 m in the z = 0 plane has uniform magnetic flux Φ_disk = 40 mWb passing through it in the +â_z direction. A hemispherical dome S_hemi of radius R is attached to the rim of the disk in the region z > 0. What is the outward magnetic flux exiting through the curved hemispherical surface S_hemi?',
        options: ['+40 mWb', '-40 mWb', '+80 mWb', '0 mWb'],
        correctAnswer: '+40 mWb',
        explanation:
          'By Gauss’s Law, total flux through the closed volume formed by the disk base and hemispherical dome is 0. All flux entering through the flat base (+40 mWb) must exit through the curved dome, so Φ_hemi = +40 mWb.',
      },
      {
        _id: 'glm-med-9',
        type: 'MCQ',
        difficulty: 'MEDIUM',
        points: 2,
        timeLimitSeconds: 120,
        question:
          'The magnetic field of a point magnetic dipole m = m â_z in spherical coordinates is B(r, θ) = [μ₀ m / (4π r³)] (2cosθ â_r + sinθ â_θ). Calculate ∇ · B for r > 0.',
        options: [
          '0 (Gauss’s Law is satisfied)',
          'μ₀ m / (4π r⁴)',
          '-μ₀ m / (2π r⁴)',
          '2 cosθ / r³',
        ],
        correctAnswer: '0 (Gauss’s Law is satisfied)',
        explanation:
          'Evaluating in spherical coordinates yields (1/r²) ∂(r² B_r)/∂r + (1/(r sinθ)) ∂(sinθ B_θ)/∂θ = -2μ₀ m cosθ / (4π r⁴) + 2μ₀ m cosθ / (4π r⁴) = 0.',
      },

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'glm-hard-1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'A toroidal core of rectangular cross-section has inner radius a = 10 cm, outer radius b = 20 cm, height h = 5 cm, and is wound with N = 500 turns carrying current I = 2.0 A in free space (μ₀ = 4π × 10⁻⁷ H/m). What is the total magnetic flux Φ passing through the rectangular cross-section?',
        options: ['6.93 μWb', '10.00 μWb', '3.47 μWb', '13.86 μWb'],
        correctAnswer: '6.93 μWb',
        explanation:
          'Φ = ∫_a^b [μ₀ N I / (2π ρ)] h dρ = [μ₀ N I h / 2π] ln(b/a) = [(4π × 10⁻⁷)(500)(2)(0.05) / 2π] ln(2) = 10⁻⁵ ln(2) ≈ 6.93 μWb.',
      },
      {
        _id: 'glm-hard-2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'The magnetic vector potential in a region is given in Cartesian coordinates by A = (x² y â_x - 2x z â_y + y z² â_z) Wb/m. Find the magnitude of the magnetic flux density |B| at the point P(1, 2, -1).',
        options: [
          '3.16 T (√10 T)',
          '4.24 T',
          '2.24 T (√5 T)',
          '5.00 T',
        ],
        correctAnswer: '3.16 T (√10 T)',
        explanation:
          'B = ∇ × A = (z² + 2x)â_x + 0â_y + (-2z - x²)â_z. At (1, 2, -1): B = 3â_x + 1â_z T => |B| = √(3² + 1²) = √10 ≈ 3.162 T.',
      },
      {
        _id: 'glm-hard-3',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'In hypothetical electromagnetic theories incorporating magnetic monopoles, Gauss’s Law for Magnetism is generalized to ∮_S B · dS = q_m (where magnetic charge q_m is defined in units of magnetic flux, Webers). According to Dirac’s quantization condition (q_e q_m = n h), what is the fundamental magnetic flux quantum Φ_min = q_m passing outward through a closed surface enclosing a single elementary Dirac magnetic monopole? (h = 6.626 × 10⁻³⁴ J·s, e = 1.602 × 10⁻¹⁹ C)',
        options: [
          'Φ = h/e ≈ 4.14 × 10⁻¹⁵ Wb (Dirac flux quantum)',
          'Φ = 0 Wb',
          'Φ = h/(2e) ≈ 2.07 × 10⁻¹⁵ Wb',
          'Φ = 1.60 × 10⁻¹⁹ Wb',
        ],
        correctAnswer: 'Φ = h/e ≈ 4.14 × 10⁻¹⁵ Wb (Dirac flux quantum)',
        explanation:
          'Under the standard flux-charge convention ∮_S B · dS = q_m, Dirac’s quantization condition gives q_m = h/e = (6.626 × 10⁻³⁴ J·s) / (1.602 × 10⁻¹⁹ C) ≈ 4.136 × 10⁻¹⁵ Wb.',
      },
      {
        _id: 'glm-hard-4',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'Given the magnetic flux density B = C₀ (ρ cosφ â_ρ - 2ρ sinφ â_φ + k z â_z) in cylindrical coordinates, what value must the constant k have for this field to satisfy Gauss’s Law for Magnetism ∇ · B = 0?',
        options: ['k = 0', 'k = 1', 'k = -2', 'k = 2'],
        correctAnswer: 'k = 0',
        explanation:
          '∇ · B = (1/ρ) ∂(ρ² cosφ)/∂ρ + (1/ρ) ∂(-2ρ sinφ)/∂φ + ∂(kz)/∂z = 2cosφ - 2cosφ + k = k. Thus k = 0 is required for ∇ · B = 0.',
      },
      {
        _id: 'glm-hard-5',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'At the source-free boundary between medium 1 (μ_r1 = 1.0) and ferromagnetic medium 2 (μ_r2 = 1000.0), a magnetic field line in medium 1 makes an angle θ₁ = 30° with the normal to the interface. Using the boundary conditions B_1n = B_2n and H_1t = H_2t, what angle θ₂ does the refracted magnetic field line make with the normal in medium 2?',
        options: [
          '89.90° (Nearly tangential to the boundary)',
          '30.00°',
          '0.058°',
          '45.00°',
        ],
        correctAnswer: '89.90° (Nearly tangential to the boundary)',
        explanation:
          'tanθ₂ / tanθ₁ = μ₂ / μ₁ => tanθ₂ = 1000 tan(30°) = 577.35 => θ₂ = tan⁻¹(577.35) ≈ 89.90°. In high-permeability media, magnetic flux lines bend almost completely parallel to the surface.',
      },
      {
        _id: 'glm-hard-6',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 3,
        timeLimitSeconds: 120,
        question:
          'If B = ∇ × A, which mathematical gauge transformation allows the vector potential A to be modified to A’ = A + ∇ψ (where ψ is any smooth scalar function) without changing the physical magnetic field B?',
        options: [
          'B’ = ∇ × (A + ∇ψ) = ∇ × A + ∇ × (∇ψ) = B + 0 = B (due to the null identity ∇ × ∇ψ ≡ 0)',
          'B’ = B + ∇ · ψ',
          'B’ = B - ∇²ψ',
          'B’ = B × ∇ψ',
        ],
        correctAnswer:
          'B’ = ∇ × (A + ∇ψ) = ∇ × A + ∇ × (∇ψ) = B + 0 = B (due to the null identity ∇ × ∇ψ ≡ 0)',
        explanation:
          'Because ∇ × (∇ψ) ≡ 0 for any scalar field ψ, adding ∇ψ to A leaves B = ∇ × A invariant. This is the foundation of gauge freedom (e.g., Coulomb gauge ∇ · A = 0 and Lorenz gauge).',
      },
    ],
  },

  // ── CHAPTER: FARADAY'S LAW (20 Total) ──
  // Breakdown: 5 EASY · 9 MEDIUM · 6 HARD
  'faraday-law': {
    module: 'maxwell-equations',
    chapter: 'faraday-law',
    title: "Faraday's Law",
    questions: [
      // ── 🟢 EASY QUESTIONS (5 Total) ──
      {
        _id: 'fl-easy-1',
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
        _id: 'fl-easy-2',
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
        _id: 'fl-easy-3',
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
        _id: 'fl-easy-4',
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
        _id: 'fl-easy-5',
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

      // ── 🟡 MEDIUM QUESTIONS (9 Total) ──
      {
        _id: 'fl-med-1',
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
        _id: 'fl-med-2',
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
        _id: 'fl-med-3',
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
        _id: 'fl-med-4',
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
        _id: 'fl-med-5',
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
        _id: 'fl-med-6',
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
        _id: 'fl-med-7',
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
        _id: 'fl-med-8',
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
        _id: 'fl-med-9',
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

      // ── 🔴 HARD QUESTIONS (6 Total) ──
      {
        _id: 'fl-hard-1',
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
        _id: 'fl-hard-2',
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
        _id: 'fl-hard-3',
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
        _id: 'fl-hard-4',
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
        _id: 'fl-hard-5',
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
        _id: 'fl-hard-6',
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
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// ALL LOCAL QUIZZES MAP
// ══════════════════════════════════════════════════════════════
export const allLocalQuizzes: Record<string, Record<string, ChapterQuizData>> = {
  electrostatics: electrostaticsQuizzes,
  'transmission-lines': transmissionLinesQuizzes,
  'maxwell-equations': maxwellEquationsQuizzes,
};


