"use server";

import { analyzeLegalContract, type AnalyzeContractInput, type AnalyzeContractOutput } from "@/ai/flows/analyze-legal-contract";

export async function analyzeContractAction(
  input: AnalyzeContractInput
): Promise<{ success: boolean; data: AnalyzeContractOutput | null; error?: string }> {
  try {
    const output = await analyzeLegalContract(input);
    if (!output) {
      return { success: false, data: null, error: "AI analysis failed to produce an output." };
    }
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred during contract analysis.";
    return { success: false, data: null, error };
  }
}
