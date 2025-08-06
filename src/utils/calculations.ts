import { ComplexNumber } from "./ComplexNumber";

interface InputValues {
  I_sg: number;
  frequency: number;
  S: number;
  d: number;
  r_g: number;
}

export function calculateEquations(inputs: InputValues) {
  const { I_sg, frequency, S, d, r_g } = inputs;

  // Common factor: jω(2×10^-7)
  const commonFactor = 2e-7 * 2 * Math.PI * frequency;

  // Calculate E_a
  const log_term_a = Math.log((2 * S ** 2) / (d * r_g));
  const E_a = new ComplexNumber(commonFactor * log_term_a * I_sg, 0);

  return {
    E_a,
  };
}
