import React from "react";
import { ComplexNumber } from "../utils/ComplexNumber";

interface ResultCardProps {
  title: string;
  result: ComplexNumber;
  color: "blue" | "green" | "orange";
}

export function ResultCard({ title, result, color }: ResultCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
  };

  const magnitude = result.magnitude();
  const phase = result.phase();
  const phaseDegrees = (phase * 180) / Math.PI;

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="font-semibold text-sm mb-3">{title}</h3>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Real:</span>
            <div className="font-mono font-medium">{result.real} V/m</div>
          </div>
          <div>
            <span className="text-gray-600">Imaginary:</span>
            <div className="font-mono font-medium">
              {result.imag >= 0 ? "+" : ""}
              {result.imag.toExponential(3)}j V/m
            </div>
          </div>
        </div>

        <div className="border-t pt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Magnitude:</span>
            <div className="font-mono font-bold">{magnitude} V/m</div>
          </div>
          <div>
            <span className="text-gray-600">Phase:</span>
            <div className="font-mono font-bold">{phaseDegrees}°</div>
          </div>
        </div>
      </div>
    </div>
  );
}
