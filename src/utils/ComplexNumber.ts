export class ComplexNumber {
  constructor(public real: number, public imag: number) {}

  static fromPolar(magnitude: number, phase: number): ComplexNumber {
    return new ComplexNumber(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.real + other.real, this.imag + other.imag);
  }

  multiply(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  multiplyScalar(scalar: number): ComplexNumber {
    return new ComplexNumber(this.real * scalar, this.imag * scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  toString(): string {
    const sign = this.imag >= 0 ? '+' : '';
    return `${this.real.toFixed(4)} ${sign} ${this.imag.toFixed(4)}j`;
  }
}