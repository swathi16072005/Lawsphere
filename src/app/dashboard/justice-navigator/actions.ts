"use server";

import {
  generateLegalActionPlan,
  type LegalActionPlanInput,
  type LegalActionPlanOutput,
} from "@/ai/flows/generate-legal-action-plan";

export async function getLegalActionPlan(
  input: LegalActionPlanInput
): Promise<{ success: boolean; data: LegalActionPlanOutput | null; error?: string }> {
  try {
    const output = await generateLegalActionPlan(input);
    if (!output) {
      return { success: false, data: null, error: "AI analysis failed to produce an output." };
    }
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, data: null, error };
  }
}
