"use server";

import {
  assessCaseAndSuggestProofs,
  type AssessCaseInput,
  type AssessCaseOutput,
} from "@/ai/flows/assess-case-and-suggest-proofs";

export async function assessCaseAction(
  input: AssessCaseInput
): Promise<{ success: boolean; data: AssessCaseOutput | null; error?: string }> {
  try {
    const output = await assessCaseAndSuggestProofs(input);
    if (!output) {
      return { success: false, data: null, error: "AI analysis failed to produce an output." };
    }
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred during case assessment.";
    return { success: false, data: null, error };
  }
}
