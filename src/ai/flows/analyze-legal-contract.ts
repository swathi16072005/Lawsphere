'use server';
/**
 * @fileOverview A legal contract analysis AI agent.
 *
 * - analyzeLegalContract - A function that handles the legal contract analysis process.
 * - AnalyzeContractInput - The input type for the analyzeLegalContract function.
 * - AnalyzeContractOutput - The return type for the analyzeLegalContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AnalyzeContractInputSchema = z.object({
  contractContent: z.string().describe('The full text content of the legal contract to be analyzed.'),
});
export type AnalyzeContractInput = z.infer<typeof AnalyzeContractInputSchema>;

// Output Schemas
const ClauseAssessmentSchema = z.object({
  text: z.string().describe('The full text of the identified clause.'),
  type: z.string().describe('The category or type of the clause (e.g., "Termination", "Payment", "Liability", "Confidentiality", "Dispute Resolution").'),
  assessment: z.enum(['Unfair', 'Standard']).describe('Assessment of the clause: "Unfair" (should be highlighted in RED) or "Standard" (should be highlighted in GREEN).'),
  explanation: z.string().describe('A brief explanation for the assessment of this clause, considering general legal fairness and common Indian legal practices.'),
});

const MissingClauseSchema = z.object({
  name: z.string().describe('The name of an important clause that is typically found in this type of contract but is missing.'),
  reason: z.string().describe('An explanation of why this clause is important and what risks its absence might pose to the user.'),
});

const AnalyzeContractOutputSchema = z.object({
  clauses: z.array(ClauseAssessmentSchema).describe('A list of all extracted clauses with their type, fairness assessment, and explanation.'),
  missingClauses: z.array(MissingClauseSchema).describe('A list of important clauses that are typically found in such contracts but are missing from the provided contract, along with reasons why their absence is notable.'),
});
export type AnalyzeContractOutput = z.infer<typeof AnalyzeContractOutputSchema>;

// Wrapper function
export async function analyzeLegalContract(input: AnalyzeContractInput): Promise<AnalyzeContractOutput> {
  return analyzeLegalContractFlow(input);
}

// Prompt definition
const analyzeContractPrompt = ai.definePrompt({
  name: 'analyzeContractPrompt',
  input: { schema: AnalyzeContractInputSchema },
  output: { schema: AnalyzeContractOutputSchema },
  prompt: `You are an expert legal assistant specializing in Indian contract law. Your task is to meticulously analyze the provided legal contract and identify its key clauses.
For each clause, you must categorize it (e.g., Termination, Payment, Liability, Confidentiality, Dispute Resolution), assess its fairness as either "Unfair" or "Standard", and provide a concise explanation for your assessment, keeping in mind the common legal practices and consumer protection aspects in India.
Additionally, you need to identify any crucial clauses that are typically expected in this type of contract but are missing from the provided document. For each missing clause, explain why its absence is significant and what risks it might introduce.

Contract Content to Analyze:
{{{contractContent}}}`,
});

// Flow definition
const analyzeLegalContractFlow = ai.defineFlow(
  {
    name: 'analyzeLegalContractFlow',
    inputSchema: AnalyzeContractInputSchema,
    outputSchema: AnalyzeContractOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeContractPrompt(input);
    if (!output) {
      throw new Error('Failed to analyze the legal contract.');
    }
    return output;
  }
);
