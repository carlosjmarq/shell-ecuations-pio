import { ComplexNumber } from "./ComplexNumber";

interface InputValues {
  I_sg: number;
  R_g: number;
  frequency: number;
  S_ag: number;
  S_bg: number;
  S_cg: number;
  S_ab: number;
  S_ac: number;
  d: number;
  r_g: number;
}

export function calculateEquations(inputs: InputValues) {
  const { I_sg, R_g, frequency, S_ag, S_bg, S_cg, S_ab, S_ac, d, r_g } = inputs;

  // Common factor: jω(2×10^-7)
  const commonFactor = 2e-7 * 2 * Math.PI * frequency;

  // Calculate E_a
  const log_term_a = Math.log((2 * S_ag ** 2) / (d * r_g));
  const impedance_a = new ComplexNumber(R_g, commonFactor * log_term_a);
  const E_a = impedance_a.multiplyScalar(I_sg);

  // Calculate E_b
  const log_term_b = Math.log((S_ag * S_bg) / (r_g * S_ab));
  const impedance_b = new ComplexNumber(R_g, commonFactor * log_term_b);
  const E_b = impedance_b.multiplyScalar(I_sg);

  // Calculate E_c
  const log_term_c = Math.log((S_ag * S_cg) / (r_g * S_ac));
  const impedance_c = new ComplexNumber(R_g, commonFactor * log_term_c);
  const E_c = impedance_c.multiplyScalar(I_sg);

  return {
    E_a,
    E_b,
    E_c,
  };
}
