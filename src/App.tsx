import React, { useState, useEffect } from "react";
import { Calculator, Zap, Info } from "lucide-react";
import { InputField } from "./components/InputField";
import { ResultCard } from "./components/ResultCard";
import { ComplexNumber } from "./utils/ComplexNumber";
import { calculateEquations } from "./utils/calculations";

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

function App() {
  const [inputs, setInputs] = useState<InputValues>({
    I_sg: 1000,
    R_g: 0.5,
    frequency: 50,
    S_ag: 1.5,
    S_bg: 2.0,
    S_cg: 2.5,
    S_ab: 0.3,
    S_ac: 0.6,
    d: 0.05,
    r_g: 0.02,
  });

  const [results, setResults] = useState<{
    E_a: ComplexNumber;
    E_b: ComplexNumber;
    E_c: ComplexNumber;
  } | null>(null);

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      const newErrors: string[] = [];

      // Validate inputs
      if (inputs.I_sg <= 0) newErrors.push("Fault current must be positive");
      if (inputs.R_g < 0)
        newErrors.push("Ground resistance cannot be negative");
      if (inputs.frequency <= 0)
        newErrors.push("Angular frequency must be positive");
      if (inputs.S_ag <= 0 || inputs.S_bg <= 0 || inputs.S_cg <= 0) {
        newErrors.push("All spacing values must be positive");
      }
      if (inputs.S_ab <= 0 || inputs.S_ac <= 0) {
        newErrors.push("Cable spacing values must be positive");
      }
      if (inputs.d <= 0)
        newErrors.push("Ground conductor diameter must be positive");
      if (inputs.r_g <= 0)
        newErrors.push("Ground conductor radius must be positive");

      setErrors(newErrors);

      if (newErrors.length === 0) {
        const calculatedResults = calculateEquations(inputs);
        setResults(calculatedResults);
      } else {
        setResults(null);
      }
    } catch (error) {
      setErrors(["Calculation error occurred"]);
      setResults(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof InputValues, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Shield-Sheath Overvoltage Calculator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate shield-sheath-to-ground conductor voltages for
            single-phase ground fault conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Input Parameters
              </h2>
            </div>

            <div className="space-y-6">
              {/* Fault Current */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Fault Current
                </h3>
                <InputField
                  label="I_sg"
                  value={inputs.I_sg}
                  onChange={(value) => handleInputChange("I_sg", value)}
                  unit="A"
                  description="Fault current magnitude"
                />
              </div>

              {/* Ground Parameters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Ground Conductor
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="R_g"
                    value={inputs.R_g}
                    onChange={(value) => handleInputChange("R_g", value)}
                    unit="Ω/m"
                    description="Ground resistance"
                  />
                  <InputField
                    label="r_g"
                    value={inputs.r_g}
                    onChange={(value) => handleInputChange("r_g", value)}
                    unit="m"
                    description="Ground conductor radius"
                  />
                </div>
              </div>

              {/* System Parameters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  System Parameters
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="f"
                    value={inputs.frequency}
                    onChange={(value) => handleInputChange("frequency", value)}
                    unit="Hz"
                    description="Frequency"
                  />
                  <InputField
                    label="d"
                    value={inputs.d}
                    onChange={(value) => handleInputChange("d", value)}
                    unit="m"
                    description="Ground conductor diameter"
                  />
                </div>
              </div>

              {/* Geometric Spacings */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Cable to Ground Spacings
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <InputField
                    label="S_ag"
                    value={inputs.S_ag}
                    onChange={(value) => handleInputChange("S_ag", value)}
                    unit="m"
                    description="Phase A to ground"
                  />
                  <InputField
                    label="S_bg"
                    value={inputs.S_bg}
                    onChange={(value) => handleInputChange("S_bg", value)}
                    unit="m"
                    description="Phase B to ground"
                  />
                  <InputField
                    label="S_cg"
                    value={inputs.S_cg}
                    onChange={(value) => handleInputChange("S_cg", value)}
                    unit="m"
                    description="Phase C to ground"
                  />
                </div>
              </div>

              {/* Inter-phase Spacings */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Inter-phase Spacings
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="S_ab"
                    value={inputs.S_ab}
                    onChange={(value) => handleInputChange("S_ab", value)}
                    unit="m"
                    description="Phase A to B spacing"
                  />
                  <InputField
                    label="S_ac"
                    value={inputs.S_ac}
                    onChange={(value) => handleInputChange("S_ac", value)}
                    unit="m"
                    description="Phase A to C spacing"
                  />
                </div>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">
                    Input Errors:
                  </span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Calculation Results
            </h2>

            {results ? (
              <div className="space-y-4">
                <ResultCard
                  title="Phase A Shield Voltage (E_a)"
                  result={results.E_a}
                  color="blue"
                />
                <ResultCard
                  title="Phase B Shield Voltage (E_b)"
                  result={results.E_b}
                  color="green"
                />
                <ResultCard
                  title="Phase C Shield Voltage (E_c)"
                  result={results.E_c}
                  color="orange"
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter valid parameters to see results</p>
              </div>
            )}

            {/* Equations Display */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Equations Used:
              </h3>
              <div className="text-sm text-gray-700 space-y-2 font-mono">
                <div>E_a = I_sg × [R_g + jω(2×10⁻⁷) × ln(2S_ag^2/(d×r_g))]</div>
                <div>
                  E_b = I_sg × [R_g + jω(2×10⁻⁷) × ln(S_ag×S_bg/(r_g×S_ab))]
                </div>
                <div>
                  E_c = I_sg × [R_g + jω(2×10⁻⁷) × ln(S_ag×S_cg/(r_g×S_ac))]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
