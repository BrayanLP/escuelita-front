// SummarizeForumThread.ts
'use server';

/**
 * @fileOverview Summarizes a forum thread to provide a quick understanding of the main points.
 *
 * - summarizeForumThread - A function that handles the summarization of a forum thread.
 * - SummarizeForumThreadInput - The input type for the summarizeForumThread function.
 * - SummarizeForumThreadOutput - The return type for the summarizeForumThread function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForumThreadInputSchema = z.object({
  threadTitle: z.string().describe('The title of the forum thread.'),
  posts: z.array(z.string()).describe('An array of forum posts in the thread.'),
});
export type SummarizeForumThreadInput = z.infer<typeof SummarizeForumThreadInputSchema>;

const SummarizeForumThreadOutputSchema = z.object({
  summary: z.string().describe('A summary of the forum thread.'),
});
export type SummarizeForumThreadOutput = z.infer<typeof SummarizeForumThreadOutputSchema>;

export async function summarizeForumThread(input: SummarizeForumThreadInput): Promise<SummarizeForumThreadOutput> {
  return summarizeForumThreadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeForumThreadPrompt',
  input: {schema: SummarizeForumThreadInputSchema},
  output: {schema: SummarizeForumThreadOutputSchema},
  prompt: `You are an expert forum thread summarizer.

  Given the title and posts of a forum thread, you will generate a concise summary of the thread.

  Title: {{{threadTitle}}}
  Posts:
  {{#each posts}}
  - {{{this}}}
  {{/each}}
  `,
});

const summarizeForumThreadFlow = ai.defineFlow(
  {
    name: 'summarizeForumThreadFlow',
    inputSchema: SummarizeForumThreadInputSchema,
    outputSchema: SummarizeForumThreadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
