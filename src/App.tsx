import { useState, useEffect } from "react";
import { Calculator, Zap, Info } from "lucide-react";
import { InputField } from "./components/InputField";
import { ResultCard } from "./components/ResultCard";
import { ComplexNumber } from "./utils/ComplexNumber";
import { calculateEquations } from "./utils/calculations";

interface InputValues {
  I_sg: number;
  R_g: number;
  frequency: number;
  S: number;
  d: number;
  r_g: number;
}

function App() {
  const [inputs, setInputs] = useState<InputValues>({
    I_sg: 1000,
    R_g: 0.5,
    frequency: 50,
    S: 1.5,
    d: 0.05,
    r_g: 0.02,
  });

  const [results, setResults] = useState<{
    E_a: ComplexNumber;
  } | null>(null);

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      const newErrors: string[] = [];

      // Validate inputs
      if (inputs.I_sg <= 0) newErrors.push("Fault current must be positive");
      if (inputs.frequency <= 0)
        newErrors.push("Angular frequency must be positive");
      if (inputs.S <= 0) {
        newErrors.push("All spacing values must be positive");
      }
      if (inputs.d <= 0)
        newErrors.push("geometric mean sheath diameter must be positive");
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
      console.error("Calculation error:", error);
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
              <div className="flex flex-row justify-between w-full ">
                <div className="w-full">
                  <h3 className="font-medium text-gray-900 mb-3 w-full">
                    Ground Conductor
                  </h3>
                  <div className="grid gap-4 max-w-[160px]">
                    <InputField
                      label="r_g"
                      value={inputs.r_g}
                      onChange={(value) => handleInputChange("r_g", value)}
                      unit="m"
                      description="Ground conductor radius"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="font-medium text-gray-900 mb-3 ">
                    Cable to Ground Spacings
                  </h3>
                  <div className="grid  gap-4 max-w-[160px]">
                    <InputField
                      label="S"
                      value={inputs.S}
                      onChange={(value) => handleInputChange("S", value)}
                      unit="m"
                      description="Phase A to ground"
                    />
                  </div>
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
                    description="geometric mean sheath diameter"
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
                <div>E_a = jω(2×10⁻⁷)× I_sg × ln(2S^2/(d×r_g))</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
