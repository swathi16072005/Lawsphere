'use server';
/**
 * @fileOverview A Genkit flow for generating a legal action plan based on a user's problem description.
 *
 * - generateLegalActionPlan - A function that handles the generation of the legal action plan.
 * - LegalActionPlanInput - The input type for the generateLegalActionPlan function.
 * - LegalActionPlanOutput - The return type for the generateLegalActionPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const LegalActionPlanInputSchema = z.object({
  problemDescription: z.string().describe("A plain language description of the user's legal problem.")
});
export type LegalActionPlanInput = z.infer<typeof LegalActionPlanInputSchema>;

// Output Schema
const LegalActionPlanOutputSchema = z.object({
  relevantLawSections: z.array(
    z.object({
      section: z.string().describe('The relevant Indian Law section (e.g., "Section 107 of the Transfer of Property Act, 1882").'),
      explanation: z.string().describe('A simplified explanation of the law section and its relevance.')
    })
  ).describe('A list of relevant Indian Law sections with explanations.'),
  precedentJudgments: z.array(
    z.object({
      caseName: z.string().describe('The name of a landmark Indian court case (e.g., "R. v. J.B. (1998) 2 S.C.R. 297").'),
      summary: z.string().describe('A brief summary of the judgment and its applicability to the user\u0027s problem.')
    })
  ).describe('A list of precedent judgments (past cases) with summaries.'),
  whyThisMatters: z.string().describe('A simplified explanation of the legal jargon and its practical implications for the user\u0027s specific case.')
}).describe('The comprehensive legal action plan.');
export type LegalActionPlanOutput = z.infer<typeof LegalActionPlanOutputSchema>;

// Wrapper function to call the flow
export async function generateLegalActionPlan(input: LegalActionPlanInput): Promise<LegalActionPlanOutput> {
  return generateLegalActionPlanFlow(input);
}

// Prompt definition
const generateLegalActionPlanPrompt = ai.definePrompt({
  name: 'generateLegalActionPlanPrompt',
  input: { schema: LegalActionPlanInputSchema },
  output: { schema: LegalActionPlanOutputSchema },
  prompt: `You are an expert AI-based legal assistant specializing in Indian Law, designed to help common citizens understand their legal problems.\nYour goal is to provide a comprehensive "Legal Action Plan" based on the user's problem description.\nYou have access to a vast knowledge base of Indian Law sections (like IPC, Consumer Protection Act, IT Act, etc.) and landmark judgments.\n\nBased on the user's problem, identify relevant Indian Law sections and precedent judgments.\nThen, provide a clear, simplified explanation of why these legal points matter to the user's specific case, avoiding complex legal jargon.\n\nInput Problem Description: "{{problemDescription}}"\n\nGenerate a structured JSON output containing the relevant law sections, precedent judgments, and a "why this matters" explanation directly as the root object, as defined by the output schema.\nEnsure all law sections and case names are plausible and reflect typical Indian legal contexts, even if not factually verifiable for this simulation.\n`
});

// Flow definition
const generateLegalActionPlanFlow = ai.defineFlow(
  {
    name: 'generateLegalActionPlanFlow',
    inputSchema: LegalActionPlanInputSchema,
    outputSchema: LegalActionPlanOutputSchema,
  },
  async (input) => {
    // Call the prompt with the user's input
    const { output } = await generateLegalActionPlanPrompt(input);
    // The output from the prompt is already in the desired structured format
    return output!;
  }
);
