"use client";

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, BrainCircuit } from 'lucide-react';

interface AgenticStepsProps {
  steps: string[];
  isProcessing: boolean;
}

export function AgenticSteps({ steps, isProcessing }: AgenticStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 1500); // Simulate time per step

      return () => clearInterval(interval);
    }
  }, [isProcessing, steps.length]);

  if (!isProcessing) return null;

  return (
    <div className="mt-6 p-4 rounded-lg border bg-secondary/50">
        <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <h3 className="font-headline text-lg font-medium text-primary">AI is thinking...</h3>
        </div>
        <div className="space-y-3">
        {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground transition-colors duration-300">
            {index < currentStep ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : index === currentStep ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
                <div className="w-4 h-4" />
            )}
            <span className={index === currentStep ? "font-medium text-foreground" : ""}>
                {step}
            </span>
            </div>
        ))}
        </div>
    </div>
  );
}
