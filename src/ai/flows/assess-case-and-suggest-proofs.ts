'use server';
/**
 * @fileOverview An AI agent for assessing case strength and suggesting proofs based on Indian Law.
 *
 * - assessCaseAndSuggestProofs - A function that handles the case assessment and proof suggestion process.
 * - AssessCaseInput - The input type for the assessCaseAndSuggestProofs function.
 * - AssessCaseOutput - The return type for the assessCaseAndSuggestProofs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCaseInputSchema = z
  .object({
    legalSituationDescription: z
      .string()
      .optional()
      .describe(
        'A plain language description of the legal problem or situation.'
      ),
    documentDataUri: z
      .string()
      .optional()
      .describe(
        "A legal document (e.g., contract, notice) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported types: PDF, plain text."
      ),
  })
  .refine(
    data => data.legalSituationDescription || data.documentDataUri,
    'Either a legal situation description or a document data URI must be provided.'
  );
export type AssessCaseInput = z.infer<typeof AssessCaseInputSchema>;

const AssessCaseOutputSchema = z.object({
  caseStrengthScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A numerical score from 0 to 100 representing the strength of the case, where 100 is strongest.'),
  caseStrengthExplanation: z
    .string()
    .describe('A detailed explanation of the assessed case strength, considering Indian Law principles.'),
  suggestedProofs: z
    .array(z.string())
    .describe('A list of suggested proofs or evidence that could strengthen the user\'s legal position in the context of Indian Law.'),
});
export type AssessCaseOutput = z.infer<typeof AssessCaseOutputSchema>;

export async function assessCaseAndSuggestProofs(
  input: AssessCaseInput
): Promise<AssessCaseOutput> {
  return assessCaseAndSuggestProofsFlow(input);
}

const assessCasePrompt = ai.definePrompt({
  name: 'assessCasePrompt',
  input: { schema: AssessCaseInputSchema },
  output: { schema: AssessCaseOutputSchema },
  prompt: `You are an expert legal assistant specializing in Indian Law, specifically designed for public users. Your task is to assess the strength of a user's legal case and provide actionable suggestions for evidence.\n\nAnalyze the provided legal situation and/or document. Based on your understanding of Indian Law, assign a 'caseStrengthScore' from 0 (very weak) to 100 (very strong). Provide a clear 'caseStrengthExplanation' justifying this score, referring to relevant legal principles if possible. Finally, generate a list of 'suggestedProofs' that the user should gather to strengthen their legal position. These proofs should be practical and relevant to an average citizen.\n\nUser Input:\n{{#if legalSituationDescription}}\nLegal Situation Description: {{{legalSituationDescription}}}\n{{/if}}\n{{#if documentDataUri}}\nDocument: {{media url=documentDataUri}}\n{{/if}}\n\nConsider the specifics of Indian legal context when providing your assessment and suggestions.\n`,
});

const assessCaseAndSuggestProofsFlow = ai.defineFlow(
  {
    name: 'assessCaseAndSuggestProofsFlow',
    inputSchema: AssessCaseInputSchema,
    outputSchema: AssessCaseOutputSchema,
  },
  async (input) => {
    if (!input.legalSituationDescription && !input.documentDataUri) {
      throw new Error(
        'Either a legal situation description or a document data URI must be provided.'
      );
    }
    const { output } = await assessCasePrompt(input);
    return output!;
  }
);
